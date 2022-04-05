import React, { useContext } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../contracts/context";
import { ERC20 } from "../../../contracts/types/ERC20";
import { SmallButton } from "../../../style/tags/button";
import { ReactComponent as MetamaskLogo } from './metamask.svg';

const MetamaskLogoDiv = styled.div`
  height: 20px;
  width: 20px;
`

const DisplayText = styled.div`
  padding-left: 6px;
`

export function AddMetamask({tokenContract, displayText}: {tokenContract: ERC20, displayText?: string}) {
  const { addTokenToWallet } = useContext(Web3Context);
  
  return (
    <SmallButton style={{display: "flex", alignSelf: "flex-end", alignItems: "center", justifyContent: "center"}} 
      onClick={() => addTokenToWallet(tokenContract)}>
      <MetamaskLogoDiv>
        <MetamaskLogo/>
      </MetamaskLogoDiv>
      {displayText && <DisplayText>{displayText}</DisplayText>}
    </SmallButton>
  );
}