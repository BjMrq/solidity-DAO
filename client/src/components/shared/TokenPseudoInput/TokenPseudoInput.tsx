import React from 'react';
import styled from "styled-components";
import { PossibleSwapToken } from "../../../contracts/types";
import { bordered } from "../../../style/input-like";
import { toToken } from "../../../utils/token";

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`

const InputLabel = styled.div`
  width: 100%;
  font-size: 1em;
  text-align: left;
  font-weight: bold;
`

const PayAmountInput = styled.input`
  width: 70%;
  border: none;
  background-color: transparent;
  resize: none;
  outline: none;
  text-align: right;
  font-size: 1em;
  &:hover {
    border: none;
    background-color: transparent;
    resize: none;
    outline: none;
  }
  &:focus {
    border: none;
    background-color: transparent;
    resize: none;
    outline: none;
  }
`

const TokenPseudoInputDiv = styled.div`
  display: flex;
  margin: 10px auto;
  padding: 10px;
  width: 100%;
  height: 45px;
  background-color: #FFFFFF;
  color: #000000;
  border-radius: 6px;
  @media screen and (max-width: 600px) {
    height: 35px;
  }
`

const TokenSelect = styled.div<{multipleChoice: boolean}>`
display: flex;
align-items: center;
justify-content: space-between;
width: 40%;
background-color: transparent;
margin: 0;
padding: 4px;
font-size: 75%;
font-style: oblique;
font-weight: 600;
cursor: ${({multipleChoice}) => multipleChoice ? "pointer" : "default"};
${bordered}
`


const DownArrowDiv = styled.div`
width: 15%;
height: 100%;
display: flex;
justify-content: end;
align-items: center;
`

const TokenNameDiv = styled.div`
width: 55%;
`

const DownArrow = styled.i`
border: solid black;
border-width: 0 2px 2px 0;
display: inline-block;
padding: 3px;
margin: auto;
transform: rotate(45deg);
-webkit-transform: rotate(45deg);
`

export function TokenPseudoInput({
  multipleTokenChoice,
  inputLabel,
  tokenToDisplay,
  inputDisabled,
  inputValue,
  currentBalance,
  setInputValue,
  onTokenClick
}: {
  multipleTokenChoice?: boolean,
  inputLabel?: string,
  currentBalance?: string,
  tokenToDisplay: { 
    name: PossibleSwapToken,
    logo: JSX.Element,
  },
  inputDisabled?: boolean,
  inputValue: string,
  setInputValue?: (value: string) => void,
  onTokenClick?: () => void,
}) {
  return ( 
    <Container>
      {inputLabel && <InputLabel>{inputLabel}:</InputLabel>}
      <TokenPseudoInputDiv>
        <TokenSelect multipleChoice={Boolean(multipleTokenChoice)} onClick={onTokenClick}>
          {tokenToDisplay.logo}
          <TokenNameDiv>{tokenToDisplay.name}</TokenNameDiv>
          <DownArrowDiv>
            {multipleTokenChoice && <DownArrow/>}
          </DownArrowDiv>
        </TokenSelect>
        <PayAmountInput
          type="text"
          placeholder={
            currentBalance ? parseFloat(toToken(currentBalance)).toFixed(4) : "0"
          }
          value={inputValue !== "0" ? inputValue : ""} 
          disabled={inputDisabled} 
          onChange={({target: {value}}) => setInputValue && setInputValue(value.replace(/[^0-9.]/g, '') || "0")}/>
      </TokenPseudoInputDiv>
    </Container>
  );
}