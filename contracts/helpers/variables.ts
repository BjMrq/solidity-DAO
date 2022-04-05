import { NetworkConfigInfo } from "./types"

export const SATI_TOKEN_SUPPLY = {
  total: "1000000000",
  sale: "5000000",
  swap: "500000000",
} as const

export const MOCK_ERC20_SWAP_SUPPLY = "500000000000000000000000000" // Half total supply

export const PROPOSAL_SETTINGS = {
  votingDelayBlocks: 1,
  votingPeriodBlocks: 15,
  quorumPercentage: 0,
  executionDelaySeconds: 20,
} as const

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

export const DEVELOPMENT_CHAINS = ["hardhat", "localhost"] as const
export const TEST_CHAINS = ["rinkeby"] as const

export const PROPOSAL_IDS_FILE = "proposals.json"

export const POSSIBLE_VOTE_VALUES = {
  against: 0,
  for: 1,
  abstain: 2,
}

export const NETWORK_CONFIG: NetworkConfigInfo = {
  localhost: {},
  hardhat: {},
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  // Default one is ETH/USD contract on Kovan
  kovan: {
    blockConfirmations: 6,
  },
}

export const awaitDeployForBlocks = (networkName: string) =>
  NETWORK_CONFIG[networkName].blockConfirmations || 1

export const ROUGH_POOL_NUMBER = 16
