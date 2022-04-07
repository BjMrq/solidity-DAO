import React from 'react';
import styled from "styled-components";
import { ReactComponent as ASTROLogo } from '../../contracts/crypto-logos/ASTRO.svg';
import { PanelWrapper } from "../shared/PanelWrapper/PanelWrapper";
import { Web3Guard } from "../Web3Guard/Web3Guard";
import { AddAstroMetamask } from "./AddAstroMetamask/AddAstroMetamask";
import { Faucet } from "./Faucet/Faucet";
import { TokenSale } from "./TokenSale/TokenSale";


const BottomDiv = styled.div`
  width: 100%;
  display: flex;
  align-self: end;
  flex: auto;
  padding-bottom: 12px;
 
  @media screen and (max-width: 1200px) { 
    padding-bottom: 0;
  }
`


const TopDivSale = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  align-items: center;
`


export function TokenSales() {

  return (
    <PanelWrapper 
      isFirstPanel={true}
      title={
        <TopDivSale>
          <ASTROLogo style={{height: "70px", marginRight: "20px"}}></ASTROLogo>
          <div>Astro Light</div>
        </TopDivSale>
      }>
      <Web3Guard>
        <TokenSale/>
        <BottomDiv>
          <Faucet/>
          <AddAstroMetamask/>
        </BottomDiv>
      </Web3Guard>

    </PanelWrapper>
   
  );
}

