import { PromiEvent, TransactionReceipt } from "web3-core/types";
import { AbiItem } from "web3-utils";
import { tokenLogos } from "./crypto-logos";
import { ERC20 } from "./types/ERC20";
import { ERC20TokensSwap } from "./types/ERC20TokensSwap";
import { PayableTx } from "./types/types";
import { ProposalStates, ProposalVotes } from "./variables";

export type SellTokenLogos = typeof tokenLogos;
export type PossibleSwapToken = keyof SellTokenLogos;

export type EthereumAvailableGuard = <TCallback extends (...args: any) => any>(
  web3Callback: TCallback
) => (...callbackArgs: any[]) => ReturnType<TCallback>;

export type DeployedNetwork = "1337";

export type AbiWithNetworks = {
  networks: Record<DeployedNetwork, { address: string }>;
  abi: AbiItem[];
};

export type ERC20TokenInfo = {
  name: PossibleSwapToken;
  contract: ERC20;
};

export type SwapContractInfo = {
  pairName: string;
  swapContract: ERC20TokensSwap;
  baseToken: ERC20TokenInfo;
  quoteToken: ERC20TokenInfo;
};

export type VoidCall = () => Promise<void> | void;

export type ToastContractSend = (
  contractFunctionToSend: {
    send: (transactionOptions: PayableTx) => PromiEvent<TransactionReceipt>;
  },
  transactionOptions?: PayableTx,
  transactionDisplayName?: string
) => Promise<TransactionReceipt>;

export type AddTokenToWallet = (tokenInfo: ERC20) => Promise<void>;

export type SubmitNewColorPropositionToDao = (propositionInfo: {
  color: string;
  description: string;
}) => Promise<void>;

export type Web3ContextFunctions = {
  initWeb3: VoidCall;
  updateDaoParticipationGuard: VoidCall;
  addTokenToWallet: AddTokenToWallet;
  toastContractSend: ToastContractSend;
  submitNewColorPropositionToDao: SubmitNewColorPropositionToDao;
};

export type PossibleProposalState =
  typeof ProposalStates[keyof typeof ProposalStates];

export type PossibleProposalVotes = keyof typeof ProposalVotes;

export type NewProposalEvent = {
  returnValues: {
    proposalId: string;
  };
};
