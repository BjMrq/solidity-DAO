import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Web3Context } from "../../../../contracts/context";
import { tokenLogos } from "../../../../contracts/crypto-logos";
import { Button } from "../../../../style/tags/button";
import { ifMountedSetDataStateWith } from "../../../../utils/state-update";
import { toUnit } from "../../../../utils/token";
import { TokenPseudoInput } from "../../../shared/TokenPseudoInput/TokenPseudoInput";


export function FixRateContent() {

  const [buyingAstroAmount, setBuyingAmount] = useState("")
  const { toastContractSend , contracts: {astroSale}, currentAccount, updateDaoParticipationGuard, web3Instance} = useContext(Web3Context);
  const [currentEthBalance, setCurrentEthBalance] = useState("0")


  const buyAstro = async () => {
    if(buyingAstroAmount !== "0") {
      await toastContractSend(astroSale.methods.buyTokens(currentAccount), {value: toUnit(buyingAstroAmount)}, "Buying Astro")
      await updateDaoParticipationGuard()
      setBuyingAmount("")
    }
  }

  useEffect(() => {
    if(buyingAstroAmount === "") ifMountedSetDataStateWith(() => 
      web3Instance.eth.getBalance(currentAccount)
    , setCurrentEthBalance)
  }, [currentAccount, buyingAstroAmount])

  return (
    <Fragment>
      <TokenPseudoInput
        currentBalance={currentEthBalance}
        tokenToDisplay={tokenLogos["ETH"]}
        inputValue={buyingAstroAmount}
        setInputValue={setBuyingAmount}
      />
      <div style={{width: "100%"}}>
        <Button onClick={buyAstro}>Buy</Button>
      </div>
    </Fragment>
  )
}
