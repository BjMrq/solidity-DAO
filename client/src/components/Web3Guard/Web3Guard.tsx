import React, { Fragment, useContext } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../contracts/context";
import { Connect } from "../TokenSales/Connect/Connect";
import { NotDeployed } from "../TokenSales/NotDeployed/NotDeployed";

const ContentDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 50vh;
`

export function Web3Guard({children}: { children: JSX.Element | JSX.Element[]}) {
  const { connected, contractsDeployedOnCurrentChain} = useContext(Web3Context);

  return (
    <Fragment>
      {connected 
        ? 
        contractsDeployedOnCurrentChain
          ?
          <Fragment>
            {children}
          </Fragment>
          :
          <ContentDiv>
            <NotDeployed/> 
          </ContentDiv>
        :
        <ContentDiv>
          <Connect/>
        </ContentDiv>
      }
    </Fragment>
  )
}