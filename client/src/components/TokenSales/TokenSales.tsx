import React from 'react';
import styled from "styled-components";
import { ReactComponent as STILogo } from '../../contracts/crypto-logos/STI.svg';
import { PanelWrapper } from "../shared/PanelWrapper/PanelWrapper";
import { Web3Guard } from "../Web3Guard/Web3Guard";
import { AddSatiMetamask } from "./AddSatiMetamask/AddSatiMetamask";
import { Faucet } from "./Faucet/Faucet";
import { SatiSale } from "./SatiSale/SatiSale";


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
          <STILogo style={{height: "70px", marginRight: "20px"}}></STILogo>
          <div>Sati token sale</div>
        </TopDivSale>
      }>
      <Web3Guard>
        <SatiSale/>
        <BottomDiv>
          <Faucet/>
          <AddSatiMetamask/>
        </BottomDiv>
      </Web3Guard>

    </PanelWrapper>
   
  );
}

