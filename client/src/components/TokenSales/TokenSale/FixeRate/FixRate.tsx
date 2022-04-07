import React, { useContext, useState } from 'react';
import { Web3Context } from "../../../../contracts/context";
import { tokenLogos } from "../../../../contracts/crypto-logos";
import { toUnit } from "../../../../utils/token";
import { TokenPseudoInput } from "../../../shared/TokenPseudoInput/TokenPseudoInput";
import { TokenSaleContent } from "../TokenSaleContent";


export function FixRate() {
  const [buyingAstroAmount, setBuyingAmount] = useState("")
  const { toastContractSend , contracts: {astroSaleContract}, currentAccount, updateDaoParticipationGuard} = useContext(Web3Context);


  const buyAstro = async () => {
    await toastContractSend(astroSaleContract.methods.buyTokens(currentAccount), {value: toUnit(buyingAstroAmount)}, "Buying Astro")
    await updateDaoParticipationGuard()
    setBuyingAmount("")
  }
  
  return (
    <TokenSaleContent 
      saleTitle={"Buy Astro Light with Ether at a fixed 1ETH/ASTRO rate"}
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