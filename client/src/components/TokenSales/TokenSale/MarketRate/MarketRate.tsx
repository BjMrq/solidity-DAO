
import React from 'react';
import { TokenSaleContent } from "../TokenSaleContent";
import { MarketRateContent } from "./MarketRateContent";


export function MarketRate() { 

  return ( 
    <TokenSaleContent 
      actionDescription={"Oracles deliver off-chain data to a smart contracts. Here an oracle get the market price of the token to swap for ASTRO (ASTRO = 1$)."}
    >
      <MarketRateContent/>
    </TokenSaleContent>
  );
}
