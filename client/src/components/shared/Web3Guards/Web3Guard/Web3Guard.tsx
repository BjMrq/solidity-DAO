import React, { Fragment, useContext } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../../contracts/context";
import { Connect } from "../Connect/Connect";
import { NotDeployed } from "../NotDeployed/NotDeployed";

const ContentDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 35vh;
`

export function Web3Guard({children, displayButton, notConnectedOtherComponent}: { children: JSX.Element | JSX.Element[], displayButton?: boolean, notConnectedOtherComponent?: JSX.Element | JSX.Element[]}) {
  
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
        <Fragment>
          <ContentDiv>
            {displayButton && <Connect/>}
          </ContentDiv>
          {notConnectedOtherComponent && notConnectedOtherComponent}
        </Fragment>

      }
    </Fragment>
  )
}