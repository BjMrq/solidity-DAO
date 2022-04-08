import React, { Fragment } from 'react';
import styled from "styled-components";
import { PanelWrapper } from "../shared/PanelWrapper/PanelWrapper";

const WhitePaperText = styled.div`
  line-height: 1.5;
  text-align: start;
  font-size: 1em;
  padding-bottom: 20px;
`

// 🌔 🪐 🛰 🚀 📡

export function Whitepaper() {
  

  return (
    <PanelWrapper title="Whitepaper">
      <Fragment>
        <WhitePaperText>
          <strong>Astro Light</strong> is an educational <strong>ERC20</strong> token that aim at demonstrating different functionality of <strong>smart contracts</strong> and provide a small playground to interact with the Ethereum blockchain
          <br/>
        Among it's functionality you can buy ASTRO at different rate, either pay a fixed ETH to ASTRO rate and notice a simple <strong>transaction</strong>, or you can also <strong>swap</strong> back and forth ASTRO for other (mock)ERC20 tokens at the market price that will be provided by a Chainlink <strong>oracle</strong>. 
          <br/>
        Once you have some ASTRO you can <strong>stake</strong> it to get some more!
          <br/>
         Or participate to the <strong>DAO</strong> (Decentralized Autonomous Organization), the great Astro Light Corp inc use <strong>governance</strong> contracts to list new swap token pairs and change it's light color like a DAO.
        </WhitePaperText>
      </Fragment>
    </PanelWrapper>

  );
}
