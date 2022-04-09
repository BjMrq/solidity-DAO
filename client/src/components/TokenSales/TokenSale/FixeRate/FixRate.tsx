import React, { useContext, useState } from 'react';
import { Web3Context } from "../../../../contracts/context";
import { tokenLogos } from "../../../../contracts/crypto-logos";
import { toUnit } from "../../../../utils/token";
import { TokenPseudoInput } from "../../../shared/TokenPseudoInput/TokenPseudoInput";
import { TokenSaleContent } from "../TokenSaleContent";


export function FixRate() {
  const [buyingAstroAmount, setBuyingAmount] = useState("")
  const { toastContractSend , contracts: {astroSale}, currentAccount, updateDaoParticipationGuard} = useContext(Web3Context);


  const buyAstro = async () => {
    if(buyingAstroAmount !== "0") {
      await toastContractSend(astroSale.methods.buyTokens(currentAccount), {value: toUnit(buyingAstroAmount)}, "Buying Astro")
      await updateDaoParticipationGuard()
      setBuyingAmount("")
    }
  }
  
  return (
    <TokenSaleContent 
      actionDescription={"An ERC20 token is a standardized smart contract with a set of functions to to issue, and transfer Fungible Tokens. Here you can buy Astro Light tokens with Ether at a fixed 1ETH/3000ASTRO rate."}
      callToAction={{display: "Buy", callback: buyAstro}}
    >
      <TokenPseudoInput
        tokenToDisplay={tokenLogos["ETH"]}
        inputValue={buyingAstroAmount}
        setInputValue={setBuyingAmount}
      />
    </TokenSaleContent>
  );
}