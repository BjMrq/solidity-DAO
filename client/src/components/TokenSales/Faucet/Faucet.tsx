import React, { useContext, useState } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../contracts/context";
import { SmallButton } from "../../../style/tags/button";

const FaucetDiv = styled.div`
  width: 100%;
  text-align: left;
  align-self: self-end;
  padding-bottom: 0;
`

const FaucetCatchP = styled.div`
  font-size: 20px

  @media screen and (max-width: 600px) { 
    font-size: 14px
  }
`;

export function Faucet() {
  const [showButton, setShowButton] = useState(false)
  const { toastContractSend , contracts: {faucetContract}} = useContext(Web3Context);

  const makeItRain = async () => {
    await toastContractSend(faucetContract.methods.makeItRain(), {}, "Faucet distribution")
  }

  return (
    <FaucetDiv onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}>
      <FaucetCatchP >Psss.. no ETH?</FaucetCatchP>
      {showButton && <SmallButton onClick={makeItRain}>Make it rain</SmallButton>}
    </FaucetDiv>
  );
}
