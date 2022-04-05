import React, { useContext, useState } from 'react';
import { Web3Context } from "../../../../contracts/context";
import { tokenLogos } from "../../../../contracts/crypto-logos";
import { toUnit } from "../../../../utils/token";
import { TokenPseudoInput } from "../../../shared/TokenPseudoInput/TokenPseudoInput";
import { SatiSaleContent } from "../SatiSaleContent";


export function FixRate() {
  const [buyingSatiAmount, setBuyingAmount] = useState("")
  const { toastContractSend , contracts: {satiSaleContract}, currentAccount} = useContext(Web3Context);


  const buySati = async () => await toastContractSend(satiSaleContract.methods.buyTokens(currentAccount), {value: toUnit(buyingSatiAmount)}, "Buying Sati")
  
  return (
    <SatiSaleContent 
      saleTitle={"Buy Sati with Ether at a fixed 1ETH/3000STI rate"}
      callToAction={{display: "Buy", callback: buySati}}
    >
      <TokenPseudoInput
        tokenToDisplay={tokenLogos["ETH"]}
        inputValue={buyingSatiAmount}
        setInputValue={setBuyingAmount}
      />
    </SatiSaleContent>
  );
}
