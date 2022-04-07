import React, { useState } from 'react';
import styled from "styled-components";
import { gradientBackgroundCss } from "../../../style/card";
import { backGroundColor } from "../../../style/colors";
import { FixRate } from "./FixeRate/FixRate";
import { MarketRate } from "./MarketRate/MarketRate";

const GradientCardDiv = styled.div`
  ${gradientBackgroundCss}

  margin: 0 auto;
  
  width: 100%;

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`

const TokenSaleCard = styled.div`
  height: 53vh;
  border-radius: 6px;
  box-shadow: 11px 16px 8px rgba(0, 0, 0, 0.4);
  padding: 8% 15%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: column;

  @media screen and (max-width: 600px) { 
      padding: 6% 10%;
      height: 50vh;
  }
`

const SaleTypesDiv = styled.div`
  display: flex;
  justify-content: space-around;
  font-weight: bold;
`

const SaleTypeDiv = styled.div<{active: boolean, saleType: keyof typeof saleTypes}>`
  background-color: ${({active}) => active ? "transparent" : backGroundColor};
  border-radius: ${({saleType}) => saleType === "fixed" ? "0 0 6px 0" : "0 0 0 6px"};
  width: 100%;
  padding: 20px;
`


const saleTypes = {
  fixed: "fixed",
  market: "market"
} as const

export function TokenSale() {
  const [saleType, setSaleType] = useState<keyof typeof saleTypes>(saleTypes.market)
  
  return (
    <GradientCardDiv>
      <SaleTypesDiv>
        <SaleTypeDiv onClick={() => setSaleType(saleTypes.market)} active={ saleType === saleTypes.market} saleType={saleType}>Market Rate</SaleTypeDiv>
        <SaleTypeDiv onClick={() => setSaleType(saleTypes.fixed)} active={ saleType === saleTypes.fixed} saleType={saleType}>Fix Rate</SaleTypeDiv>
      </SaleTypesDiv>
      <TokenSaleCard>
        {saleType === saleTypes.market && <MarketRate/>}
        {saleType === saleTypes.fixed && <FixRate/>}
      </TokenSaleCard>
    </GradientCardDiv>
  );
}
