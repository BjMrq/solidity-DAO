import React, { useContext,  useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../../contracts/context";
import { tokenLogos } from "../../../../contracts/crypto-logos";
import { PossibleSwapToken, SwapContractInfo } from "../../../../contracts/types";
import { hasMoreThanOne } from "../../../../utils";
import { getPossiblePairedSwapToken, getPossibleSwapContractFromSellToken, getTokenPairMatchingSwapContract, toUnit } from "../../../../utils/token";
import { TokenPseudoInput } from "../../../shared/TokenPseudoInput/TokenPseudoInput";
import { SatiSaleContent } from "../SatiSaleContent";
import { TokenSelectModal } from "./TokenSelectModal/TokenSelectModal";
import useWebSocket from 'react-use-websocket';
import axios from "axios"

const TokenDiv = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`


type BinanceSocketPriceMessage = 
{
  "e": string,  // Event type
  "E": number,  // Event time
  "s": string,  // Symbol
  "c": string,  // Close price
  "o": string,  // Open price
  "h": string,  // High price
  "l": string,  // Low price
  "v": string,  // Total traded base asset volume
  "q": string   // Total traded quote asset volume
}


type StreamName = `${string}@${string}`

type BinanceWebsocketMessage = {stream: StreamName, data: BinanceSocketPriceMessage}

type BinanceStreamSubscriptionInfo = {
  method: 'SUBSCRIBE' | 'UNSUBSCRIBE',
  params: [StreamName],
  id: 1,
}

type SwapInfo = {
  sellTokenType: "quoteToken" | "baseToken",
  swapMethod: "swapQuoteForBaseToken" | 'swapBaseForQuoteToken'
}

type UseBinanceWebSocket = { sendJsonMessage: (jsonMessage: BinanceStreamSubscriptionInfo) => void, lastJsonMessage: BinanceWebsocketMessage | undefined }

const noPricePlaceholder = "0"

export function MarketRate() { 

  const { contracts: {swapContracts}, toastContractSend} = useContext(Web3Context);

  const [sellTokenSelectionModalOpen, setSellTokenSelectionModalOpen] = useState(false)
  const [buyTokenSelectionModalOpen, setBuyTokenSelectionModalOpen] = useState(false)

  const [presentedSwapContract, setPresentedSwapContract] = useState<SwapContractInfo>(swapContracts[0])
  
  const [sellingAmount, setSellingAmount] = useState(noPricePlaceholder)
  const [selectedSellToken, setSelectedSellToken] = useState<PossibleSwapToken>(tokenLogos.WBTC.name)

  const [selectedBuyToken, setSelectedBuyToken] = useState<PossibleSwapToken>(tokenLogos.STI.name)

  const [possibleSwapContractFromSellTokenSelect, setPossibleSwapContractFromSellTokenSelect] = useState<SwapContractInfo[]>(swapContracts)


  const swapInfo = useRef<SwapInfo>({sellTokenType: "baseToken", swapMethod: "swapBaseForQuoteToken"})
  const currentPriceRate = useRef<string>(noPricePlaceholder)


  const { sendJsonMessage, lastJsonMessage: priceSocketMessage }: UseBinanceWebSocket = useWebSocket(
    "wss://stream.binance.com:9443/stream",
  );


  const changeProposedBuyTokenIfNotSupported = (swapContracts:SwapContractInfo[], sellTokenName: PossibleSwapToken) => {
    const possibleSwapPairedToken = getPossiblePairedSwapToken(swapContracts, sellTokenName)
    if(!possibleSwapPairedToken.includes(selectedBuyToken)) setSelectedBuyToken(possibleSwapPairedToken[0])
  }

  const selectSellToken = (sellTokenName: PossibleSwapToken) => {
    setSelectedSellToken(sellTokenName)
    setSellTokenSelectionModalOpen(false)
    setSellingAmount(noPricePlaceholder)
    const newPossibleSwapContracts = getPossibleSwapContractFromSellToken(swapContracts, sellTokenName)
    setPossibleSwapContractFromSellTokenSelect(newPossibleSwapContracts)
    changeProposedBuyTokenIfNotSupported(newPossibleSwapContracts, sellTokenName)
    currentPriceRate.current = noPricePlaceholder
  }

  const selectBuyToken = (buyTokenName: PossibleSwapToken) => {
    setSelectedBuyToken(buyTokenName)
    currentPriceRate.current = noPricePlaceholder
    setBuyTokenSelectionModalOpen(false)
  }

  const calculateDisplayPrice = (priceRate: string, sellAmount: string) => {
    const priceToDisplay = swapInfo.current.swapMethod === "swapBaseForQuoteToken" ?
      parseFloat(priceRate) * parseFloat(sellAmount) : 
      parseFloat(sellAmount) / parseFloat(priceRate)

    if(priceToDisplay < 1 ) return priceToDisplay.toFixed(8)
    return priceToDisplay.toFixed(2)
  }

  useEffect(() => {
    if(priceSocketMessage?.data?.c) currentPriceRate.current = priceSocketMessage.data.c
  } , 
  [priceSocketMessage]
  )


  useEffect(() => {
    if(presentedSwapContract?.pairName){

      (async () => {
        const tradePriceToTrack = presentedSwapContract.pairName.replace("/", "").replace("STI", 'USDT').replace("WBTC", "BTC").replace("WLTC", "LTC")
      
        const {data} = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${tradePriceToTrack.toUpperCase()}`)
        
        if(data?.price) currentPriceRate.current = data.price  
      }
      )()
    }
  }
  ,
  [presentedSwapContract]
  )

  

  const initPriceSocket = (smartContractInfo: SwapContractInfo) => {

    const tradePriceToTrack = smartContractInfo.pairName.replace("/", "").replace("STI", 'USDT').replace("WBTC", "BTC").replace("WLTC", "LTC")
      .toLowerCase()

    return {
      subscribe: () => sendJsonMessage({
        method: 'SUBSCRIBE',
        params: [`${tradePriceToTrack}@miniTicker`],
        id: 1,
      }),
      unsubscribe: () => sendJsonMessage({
        method: 'UNSUBSCRIBE',
        params: [`${tradePriceToTrack}@miniTicker`],
        id: 1,
      })
    }}


  useEffect(()=> {
    const currentSwapContractInfo = getTokenPairMatchingSwapContract(
      swapContracts, 
      selectedBuyToken, 
      selectedSellToken
    )

    if(currentSwapContractInfo?.pairName) {
     
      setPresentedSwapContract(currentSwapContractInfo)
  
      swapInfo.current = currentSwapContractInfo.baseToken.name === selectedBuyToken ? 
        {sellTokenType: "quoteToken", swapMethod: "swapQuoteForBaseToken"} : 
        {sellTokenType: "baseToken", swapMethod: "swapBaseForQuoteToken"}
  
      const {subscribe, unsubscribe} = initPriceSocket(currentSwapContractInfo)
  
      subscribe()
        
      return unsubscribe
      
    }
  }, [swapContracts, selectedSellToken, selectedBuyToken])



  const swapTokens= async () => {
    const sellTokenAmount = toUnit(sellingAmount)

    await toastContractSend(
      presentedSwapContract[swapInfo.current.sellTokenType].contract
        .methods.approve(
          presentedSwapContract.swapContract.options.address, 
          sellTokenAmount
        ), {}, "Approval")

    await toastContractSend(
      presentedSwapContract.swapContract
        .methods[swapInfo.current.swapMethod](sellTokenAmount), {}, "Swap")
  }


  
  return ( 
    <SatiSaleContent 
      saleTitle={"Swap tokens for STI at market price using oracles (STI will launch at 1$)"}
      callToAction={{display: "Swap", callback: swapTokens}}
    >
      <TokenDiv>
        <TokenPseudoInput 
          inputLabel="Sell"
          multipleTokenChoice={true}
          onTokenClick={() => setSellTokenSelectionModalOpen(true)}
          tokenToDisplay={tokenLogos[selectedSellToken]}
          inputValue={sellingAmount}
          setInputValue={setSellingAmount}
        />
      </TokenDiv>
      <TokenDiv>
        <TokenPseudoInput 
          inputLabel="For approximately"
          multipleTokenChoice={hasMoreThanOne(possibleSwapContractFromSellTokenSelect)}
          onTokenClick={() => hasMoreThanOne(possibleSwapContractFromSellTokenSelect) && setBuyTokenSelectionModalOpen(true)}
          tokenToDisplay={tokenLogos[selectedBuyToken]}
          inputValue={(currentPriceRate.current !== noPricePlaceholder && sellingAmount !== noPricePlaceholder) ? 
            calculateDisplayPrice(currentPriceRate.current, sellingAmount) :
            noPricePlaceholder}
          inputDisabled={true}
        />
      </TokenDiv>
      
      <TokenSelectModal
        tokenType={"sell"}
        swapContractListToExtractTokensFrom={swapContracts}
        selectTokenCallback={selectSellToken}
        setTokenSelectionModalOpen={setSellTokenSelectionModalOpen} 
        tokenSelectionModalOpen={sellTokenSelectionModalOpen}
      />
      <TokenSelectModal
        tokenType={"buy"}
        swapContractListToExtractTokensFrom={possibleSwapContractFromSellTokenSelect}
        selectTokenCallback={selectBuyToken}
        selectedPairToken={selectedSellToken}
        setTokenSelectionModalOpen={setBuyTokenSelectionModalOpen} 
        tokenSelectionModalOpen={buyTokenSelectionModalOpen}
      />
    </SatiSaleContent>
  );
}
