import React, { Fragment } from 'react';
import styled from "styled-components";
import { PanelWrapper } from "../shared/PanelWrapper/PanelWrapper";

const WhitePaperText = styled.div`
  line-height: 1.5;
  text-align: start;
  font-size: 1em;
  padding-bottom: 20px;
`

// const WhiteRoadMap = styled.div`
//   line-height: 1.5;
//   text-align: start;
//   font-size: 1em;
//   padding: 5px;
//   font-weight: 500;
// `


export function Whitepaper() {
  

  return (
    <PanelWrapper title="Whitepaper">
      <Fragment>
        <WhitePaperText>
        Sati is an educational ERC20 token that aim at demonstrating different functionality of smart contracts and provide a small playground to interact with the Ethereum blockchain.
          <br/>
        Among it's functionality you can buy STI at different rate, either pay a fixed ETH to STI rate and notice a simple transaction, or you can also swap back and forth STI for other ERC20 tokens at the market price that will be provided by a Chainlink Oracle. 
          <br/>
        Once you have some STI you can stake it to get some more!
          <br/>
        Or participate to the DAO (Decentralized Autonomous Organization), the great Sati Corp inc use governance contract to list new swap token pairs and change it's animation color like a small DAO.
        </WhitePaperText>
        {/* <WhiteRoadMap>2022 Q1: Sati sale</WhiteRoadMap>
        <WhiteRoadMap>2022 Q2: Sati swap</WhiteRoadMap>
        <WhiteRoadMap>2022 Q3: Sati stake</WhiteRoadMap>
        <WhiteRoadMap>2022 Q4: Sati DAO</WhiteRoadMap> */}
      </Fragment>
    </PanelWrapper>

  );
}
