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
          <strong>Astro Light</strong> is an educational <strong>ERC20</strong> token that aims at demonstrating the different functionalities of <strong>smart contracts</strong> and provide a small playground to interact with the Ethereum blockchain.
          <br/>
        You can buy ASTRO at a fixed ETH to ASTRO rate and notice a simple <strong>transaction</strong>, or you can also <strong>swap</strong> ASTRO back and forth for other ERC20 tokens at the market price that will be provided by a Chainlink <strong>oracle</strong>. 
          <br/>
        Once you hold some ASTRO you can use the <strong>DEFI</strong> or Decentralized Finance platform to <strong>stake</strong> it to get some more, or swap it for an other currency.
          <br/>
         You can also propose a new Astro Light color. The great Astro Light Corp Inc. is a small <strong>DAO</strong> or Decentralized Autonomous Organization that uses <strong>governance</strong> contracts to change it's light color and list new swap token pairs.
        </WhitePaperText>
      </Fragment>
    </PanelWrapper>

  );
}
