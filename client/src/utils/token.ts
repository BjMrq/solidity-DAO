import { fromWei, toWei } from "web3-utils";
import { PossibleSwapToken, SwapContractInfo } from "../contracts/types";

export const toUnit = (tokenAmount: string | number): string =>
  toWei(String(tokenAmount), "ether");

export const toToken = (unitAmount: string | number): string =>
  fromWei(String(unitAmount), "ether");

export const getPossibleSwapContractFromSellToken = (
  swapContracts: SwapContractInfo[],
  tokenName: PossibleSwapToken
) =>
  Object.values(swapContracts).filter(({ pairName }) =>
    pairName.includes(tokenName)
  );

export const getPossiblePairedSwapToken = (
  swapContracts: SwapContractInfo[],
  tokenName: PossibleSwapToken
) =>
  swapContracts.map(
    ({ pairName }) =>
      pairName.replace(tokenName, "").replace("/", "") as PossibleSwapToken
  );

export const getTokenPairMatchingSwapContract = (
  allSwapContracts: SwapContractInfo[],
  buyToken: PossibleSwapToken,
  sellToken: PossibleSwapToken
) =>
  allSwapContracts.find(
    (contract) =>
      contract.pairName === `${buyToken}/${sellToken}` ||
      contract.pairName === `${sellToken}/${buyToken}`
  ) || ({} as SwapContractInfo);
