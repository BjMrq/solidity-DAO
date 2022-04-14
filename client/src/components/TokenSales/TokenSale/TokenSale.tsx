import React, { useState } from 'react';
import styled from "styled-components";
import { gradientBackgroundCss } from "../../../style/card";
import { backGroundColor } from "../../../style/colors";
import { FixRate } from "./FixeRate/FixRate";
import { MarketRate } from "./MarketRate/MarketRate";
import { Stake } from "./Stake/Stake";

const GradientCardDiv = styled.div`
  ${gradientBackgroundCss}

  margin: 0 auto;
  
  width: 100%;

  @media screen and (max-width: 1270px) {
    width: 80%;
  }

  @media screen and (max-width: 800px) {
    width: 100%;
  }
`

const TokenSaleCard = styled.div`
  min-height: 53vh;
  border-radius: 6px;
  box-shadow: 11px 16px 8px rgba(0, 0, 0, 0.4);
  padding: 8% 15%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: column;

  @media screen and (max-width: 1270px) { 
      padding: 6% 10%;
      min-height: 50vh;
  }

  @media screen and (max-width: 600px) { 
      padding: 6% 10%;
      min-height: 53vh;
  }
`

const SaleTypesDiv = styled.div`
  display: flex;
  justify-content: space-around;
  font-weight: bold;
`

const saleTypes = {
  buy: "buy",
  stake: "stake",
  swap: "swap"
} as const

const SaleTypeDiv = styled.div<{active: boolean, activeSellType: keyof typeof saleTypes, saleType: keyof typeof saleTypes}>`
  background-color: ${({active}) => active ? "transparent" : backGroundColor};
  border-radius: ${({saleType, active, activeSellType}) => {
    if(active)return "6px"
    if(saleType === saleTypes.buy && activeSellType === saleTypes.swap) return "0 0 6px 0"
    if(saleType === saleTypes.buy && activeSellType === saleTypes.stake) return "0"
    
    if(saleType === saleTypes.swap && activeSellType === saleTypes.buy) return "0 0 0 6px"
    if(saleType === saleTypes.swap && activeSellType === saleTypes.stake) return "0 0 6px 0"
    
    if(saleType === saleTypes.stake && activeSellType === saleTypes.buy) return "0"
    if(saleType === saleTypes.stake && activeSellType === saleTypes.swap) return "0 0 0 6px"

  }};
  width: 100%;
  padding: 20px;
`


export function TokenSale() {
  const [saleType, setSaleType] = useState<keyof typeof saleTypes>(saleTypes.buy)
  
  return (
    <GradientCardDiv>
      <SaleTypesDiv>
        <SaleTypeDiv onClick={() => setSaleType(saleTypes.buy)} active={ saleType === saleTypes.buy} saleType={saleTypes.buy} activeSellType={saleType}>Buy</SaleTypeDiv>
        <SaleTypeDiv onClick={() => setSaleType(saleTypes.swap)} active={ saleType === saleTypes.swap} saleType={saleTypes.swap} activeSellType={saleType}>Swap</SaleTypeDiv>
        <SaleTypeDiv onClick={() => setSaleType(saleTypes.stake)} active={ saleType === saleTypes.stake} saleType={saleTypes.stake} activeSellType={saleType}>Stake</SaleTypeDiv>
      </SaleTypesDiv>
      <TokenSaleCard>
        {saleType === saleTypes.buy && <FixRate/>}
        {saleType === saleTypes.swap && <MarketRate/>}
        {saleType === saleTypes.stake && <Stake/>}
      </TokenSaleCard>
    </GradientCardDiv>
  );
}
