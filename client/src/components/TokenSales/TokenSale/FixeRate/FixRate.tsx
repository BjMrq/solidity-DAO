import React from 'react';
import { TokenSaleContent } from "../TokenSaleContent";
import { FixRateContent } from "./FixRateContent";



export function FixRate() {
  
  return (
    <TokenSaleContent 
      actionDescription={"An ERC20 token is a standardized smart contract with a set of functions to issue, and transfer Fungible Tokens. Here you can buy Astro Light tokens with Ether at a fixed 1ETH/3000ASTRO rate."}
    >
      <FixRateContent/>
    </TokenSaleContent>
  );
}