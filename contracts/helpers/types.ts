import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { ERC20 } from "../typechain-types/@openzeppelin/contracts/token/ERC20/ERC20"
import { DEVELOPMENT_CHAINS, TEST_CHAINS } from "./variables"

export type PossibleNetwork = typeof DEVELOPMENT_CHAINS[number] | typeof TEST_CHAINS[number]

export type SwapTokenAddressInfo = {
  name: string
  erc20Token: ERC20
  priceFeedAddress: string
}

export type AllSwapTokenAddressInfo = Record<
  PossibleNetwork,
  {
    swapPools: SwapTokenAddressInfo[]
  }
>

type NamedAccounts<TNamedData> = {
  deployer: TNamedData
  faucetFounder: TNamedData
  faucetUser: TNamedData
  astroSender: TNamedData
  astroReceiver: TNamedData
  astroBuyer: TNamedData
  astroSeller: TNamedData
  maliciousEncounter: TNamedData
}

export type NamedAddresses = NamedAccounts<string>
export type NamedSigners = NamedAccounts<SignerWithAddress>

export type TokenAddressOrMockInfo =
  | { address: string }
  | {
      name: string
      symbol: string
    }

export type PriceFeedAddressOrMockInfo =
  | {
      rate: string
    }
  | {
      address: string
    }

export type PreSwapDeployTokenInfo = {
  baseToken: TokenAddressOrMockInfo
  quoteToken: TokenAddressOrMockInfo
  priceFeed: PriceFeedAddressOrMockInfo
  swapContract: {
    pairName: string
    baseTokenLiquidity: string
    quoteTokenLiquidity: string
  }
}

export type SwapDeployTokenInfo = {
  baseToken: {
    contract: ERC20
  }
  quoteToken: {
    contract: ERC20
  }
  priceFeed: {
    address: string
  }
  swapContract: {
    pairName: string
    baseTokenLiquidity: string
    quoteTokenLiquidity: string
  }
}

export type PreSwapDeployPerNetwork = Record<
  PossibleNetwork,
  { pairs: PreSwapDeployTokenInfo[]; chainLinkTokenAddress?: string }
>

export type NetworkConfigItem = {
  ethUsdPriceFeed?: string
  blockConfirmations?: number
}

export type NetworkConfigInfo = {
  [key: string]: NetworkConfigItem
}

export type ProposedSwapInfo = {
  proposalId: string
  encodedDeployNewSwapFunctionToCall: string
  proposalDescription: string
}
