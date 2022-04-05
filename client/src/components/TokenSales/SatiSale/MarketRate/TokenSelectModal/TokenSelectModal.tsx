import React, { useMemo } from 'react';
import Modal from 'react-modal';
import styled from "styled-components";
import { ERC20TokenInfo, PossibleSwapToken, SwapContractInfo } from "../../../../../contracts/types";
import { ERC20 } from "../../../../../contracts/types/ERC20";
import { borderRadius } from "../../../../../style/characteristics";
import { backGroundColor, lightColor } from "../../../../../style/colors";
import { scrollbar } from "../../../../../style/scrollbar";
import { TokenToSelect } from "./TokenToSelect/TokenToSelect";

Modal.setAppElement('#root');

const modalStyle = {
  content: {
    overflow: "hidden",
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: "80vh",
    width: '400px',
    maxWidth: "94vw",
    backgroundColor: backGroundColor,
    borderRadius: borderRadius,
    color: lightColor,
    border: "none",
    padding: "0",
    matchMedia: "screen and (max-width: 768px)",
  },
};

const TokenSelectContainer = styled.div`
 ${scrollbar}
 overflow-x: hidden;
 max-height: 66vh;
 width: 84%;
 background-color: ${backGroundColor};
 padding: 10px 8%;
`

const ModalTitle = styled.div`
  width: 100%;
  font-size: 2rem;
  text-align: center;
  height: 60px;
  font-weight: bold;
  padding-top: 36px;
`


type SellTokenInfo = {
  name: PossibleSwapToken,
  contract: ERC20
}

export function TokenSelectModal({
  tokenType,
  swapContractListToExtractTokensFrom,
  tokenSelectionModalOpen,
  selectedPairToken,
  setTokenSelectionModalOpen,
  selectTokenCallback
}:{
  tokenSelectionModalOpen: boolean, 
  tokenType: "sell" | "buy",
  swapContractListToExtractTokensFrom: SwapContractInfo[],
  selectedPairToken?: PossibleSwapToken,
  setTokenSelectionModalOpen: (valueToSet: boolean) => void,
  selectTokenCallback: (tokenName: PossibleSwapToken) => void
}) {

  const tokenIsNotAlreadyInMapAndNotAlreadySelected = (possibleSwapTokens: Record<PossibleSwapToken, SellTokenInfo>, tokenName: PossibleSwapToken) => !Boolean(possibleSwapTokens[tokenName]) && tokenName !== selectedPairToken

  const allPossibleSwapTokensToSelectFrom = useMemo(() => tokenSelectionModalOpen ? Object.values(swapContractListToExtractTokensFrom.reduce((possibleSwapTokens, swapContract: SwapContractInfo) => {
    if(tokenIsNotAlreadyInMapAndNotAlreadySelected(possibleSwapTokens, swapContract.baseToken.name)) possibleSwapTokens[swapContract.baseToken.name] = swapContract.baseToken
    if(tokenIsNotAlreadyInMapAndNotAlreadySelected(possibleSwapTokens, swapContract.quoteToken.name)) possibleSwapTokens[swapContract.quoteToken.name] = swapContract.quoteToken


    return possibleSwapTokens;
  }, {} as Record<PossibleSwapToken, SellTokenInfo>)) : [], [tokenSelectionModalOpen])

  
  return (
    <Modal
      isOpen={tokenSelectionModalOpen}
      onRequestClose={() => setTokenSelectionModalOpen(false)}
      style={modalStyle}
    >
      <ModalTitle>Select a token to {tokenType}</ModalTitle>
      <TokenSelectContainer>
        {allPossibleSwapTokensToSelectFrom.map((sellToken: ERC20TokenInfo) => 
          (<TokenToSelect
            key={sellToken.name} 
            tokenName={sellToken.name} 
            tokenContract={sellToken.contract}
            selectTokenCallback={selectTokenCallback}
          />
          )
        )}
      </TokenSelectContainer>
    </Modal>
  )
}