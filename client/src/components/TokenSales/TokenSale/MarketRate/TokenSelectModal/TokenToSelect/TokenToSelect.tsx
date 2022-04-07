import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Web3Context } from "../../../../../../contracts/context";
import { tokenLogos } from "../../../../../../contracts/crypto-logos";
import { PossibleSwapToken } from "../../../../../../contracts/types";
import { ERC20 } from "../../../../../../contracts/types/ERC20";
import { toToken } from "../../../../../../utils/token";
import { AddMetamask } from "../../../../../shared/AddMetamask/AddMetamask";

const TokenToSellListElement = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  font-size: 24px;
  margin: 26px 0;
  height: 45px;
  justify-content: space-between;
`

const AddTokenWalletDiv = styled.div`
  width: 10%;
`

const ClickableToken = styled.div`
    cursor: pointer;
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const SellTokenLogo = styled.div`
  text-align: right;
  width: 13%;
  padding-right: 20px;
`

const TokenName = styled.div`
  font-weight: bold;
  text-align: right;
  padding-right: 20px;
  width: 37%;
  `

const TokenBalance = styled.div`
  width: 50%;
  text-align: right;
  `

export function TokenToSelect({
  tokenName,
  tokenContract,
  selectTokenCallback
}: {
  tokenName: PossibleSwapToken, 
  tokenContract: ERC20, 
  selectTokenCallback: (tokenName: PossibleSwapToken) => void
}) {
  const { currentAccount} = useContext(Web3Context);
  const [tokenBalance, setTokenBalance] = useState("0")

  useEffect(() => {
    (async () => {
      const fullBalance = toToken(await tokenContract.methods.balanceOf(currentAccount).call())
      const flooredBalance = fullBalance.includes(".") ? fullBalance.slice(0, -16) : fullBalance
      setTokenBalance(flooredBalance)
    }
    )();
  }, [])


  return (
    <TokenToSellListElement >
      <ClickableToken onClick={() => selectTokenCallback(tokenName)}>
        <TokenBalance>{tokenBalance}</TokenBalance>
        <TokenName>{tokenName}</TokenName>
        <SellTokenLogo>{tokenLogos[tokenName].logo}</SellTokenLogo>
      </ClickableToken>
      <AddTokenWalletDiv>
        <AddMetamask tokenContract={tokenContract} ></AddMetamask>
      </AddTokenWalletDiv>
    </TokenToSellListElement>
  )
}