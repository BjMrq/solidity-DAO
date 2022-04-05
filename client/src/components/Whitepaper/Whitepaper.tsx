import React, { Fragment } from 'react';
import styled from "styled-components";
import { PanelWrapper } from "../shared/PanelWrapper/PanelWrapper";

const WhitePaperText = styled.div`
  line-height: 1.5;
  text-align: start;
  font-size: 1em;
  padding-bottom: 20px;
`

const WhiteRoadMap = styled.div`
  line-height: 1.5;
  text-align: start;
  font-size: 1em;
  padding: 5px;
  font-weight: 500;
`


export function Whitepaper() {
  

  return (
    <PanelWrapper title="Whitepaper">
      <Fragment>
        <WhitePaperText>
        Sati is a token on the Ethereum  blockchain that offers auto static rewards on every
transaction du to an innovative protocol. Hold $STI before it launch and you'll receive
ETH automatically in your wallet as a reward when
Sati token is released! The reward is calculated with the amount of $STI you hold and the time you have hold on to it.
The Sati development and tokenomic is in the hands of a fully reliable and
experienced team. This is not financial advise but do not miss this opportunity!
        </WhitePaperText>
        <WhiteRoadMap>2022 Q1: Sati sale</WhiteRoadMap>
        <WhiteRoadMap>2022 Q2: Sati swap</WhiteRoadMap>
        <WhiteRoadMap>2022 Q3: Sati stake</WhiteRoadMap>
        <WhiteRoadMap>2022 Q4: Sati DAO</WhiteRoadMap>
      </Fragment>
    </PanelWrapper>

  );
}
