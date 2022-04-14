import React from 'react';
import { TokenSaleContent } from "../TokenSaleContent";
import { StakeContent } from "./StakeContent";


export function Stake() {
  return (
    <TokenSaleContent 
      actionDescription={"Defi staking is the action of locking up your token in a smart contracts for a period of time to earn rewards or interest. Stake your ASTRO for a daily interest."}
    >
      <StakeContent/>
    </TokenSaleContent>
  );
}