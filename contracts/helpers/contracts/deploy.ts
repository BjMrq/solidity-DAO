import { ethers } from "hardhat"
import { ERC20 } from "../../typechain-types/@openzeppelin/contracts/token/ERC20/ERC20"
import { MockV3Aggregator__factory, SwapContractFactory } from "../../typechain-types"
import { withAwaitConfirmation } from "../chain/wait-transactions"
import {
  TokenAddressOrMockInfo,
  PriceFeedAddressOrMockInfo,
  SwapDeployTokenInfo,
  PreSwapDeployTokenInfo,
} from "../types"
import console from "console"

const MockPriceFeed = ethers.getContractFactory<MockV3Aggregator__factory>("MockV3Aggregator")
const MockERC20Token = ethers.getContractFactory("MockERC20Token")

export const deployPriceFeedMockWithRateOf = async (ratePrice: string) =>
  await (await MockPriceFeed).deploy(8, ratePrice, 1, 1, 1)

export const deployERC20TokenMock = async (tokenName: string, tokenSymbol: string) =>
  (await (await MockERC20Token).deploy(tokenName, tokenSymbol)) as ERC20

export const getERC20ContractAtAddressOrDeployMock = async (tokenInfo: TokenAddressOrMockInfo) =>
  "address" in tokenInfo
    ? await ethers.getContractAt<ERC20>("ERC20", tokenInfo.address)
    : await deployERC20TokenMock(tokenInfo.name, tokenInfo.symbol)

export const deployPriceFeedIfNoAddress = async (prideFeedInfo: PriceFeedAddressOrMockInfo) =>
  "address" in prideFeedInfo
    ? prideFeedInfo.address
    : (await deployPriceFeedMockWithRateOf(prideFeedInfo.rate)).address

export const deploySwapContractWithFactory =
  (SwapContractFactory: SwapContractFactory) =>
  async ({ baseToken, quoteToken, priceFeed }: SwapDeployTokenInfo) =>
    await withAwaitConfirmation(
      SwapContractFactory.deployNewSwapContract(
        baseToken.contract.address,
        quoteToken.contract.address,
        priceFeed.address
      )
    )

export const getContractsBeforeSwapDeploy = async ({
  baseToken,
  quoteToken,
  priceFeed,
  swapContract,
}: PreSwapDeployTokenInfo): Promise<SwapDeployTokenInfo> => ({
  baseToken: {
    contract: await getERC20ContractAtAddressOrDeployMock(baseToken),
  },
  quoteToken: {
    contract: await getERC20ContractAtAddressOrDeployMock(quoteToken),
  },
  priceFeed: {
    address: await deployPriceFeedIfNoAddress(priceFeed),
  },
  swapContract,
})
