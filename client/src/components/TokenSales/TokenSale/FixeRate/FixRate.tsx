import React, { useContext, useEffect, useState } from 'react';
import { Web3Context } from "../../../../contracts/context";
import { tokenLogos } from "../../../../contracts/crypto-logos";
import { ifMountedSetDataStateWith } from "../../../../utils/state-update";
import { toUnit } from "../../../../utils/token";
import { TokenPseudoInput } from "../../../shared/TokenPseudoInput/TokenPseudoInput";
import { TokenSaleContent } from "../TokenSaleContent";


export function FixRate() {
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
    <TokenSaleContent 
      actionDescription={"An ERC20 token is a standardized smart contract with a set of functions to issue, and transfer Fungible Tokens. Here you can buy Astro Light tokens with Ether at a fixed 1ETH/3000ASTRO rate."}
      callToAction={{display: "Buy", callback: buyAstro}}
    >
      <TokenPseudoInput
        currentBalance={currentEthBalance}
        tokenToDisplay={tokenLogos["ETH"]}
        inputValue={buyingAstroAmount}
        setInputValue={setBuyingAmount}
      />
    </TokenSaleContent>
  );
}