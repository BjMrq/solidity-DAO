import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { deployERC20TokenMock, deployPriceFeedMockWithRateOf } from "../helpers/contracts/deploy"
import { SwapTokenAddressInfo } from "../helpers/types"
import { ethers } from "hardhat"
import { withAwaitConfirmation } from "../helpers/chain/wait-transactions"
import { SatiToken, SwapContractFactory } from "../typechain-types"
import { MOCK_ERC20_SWAP_SUPPLY, ROUGH_POOL_NUMBER, SATI_TOKEN_SUPPLY } from "../helpers/variables"
import { calculateSatiSupplyWithNumberOfPools } from "../helpers/tokens/supply"

const daoLikeAddSwapPair: DeployFunction = async ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const GovernanceTimeLock = await ethers.getContract("GovernanceTimeLock", deployer)

  const SwapContractFactory = await ethers.getContract<SwapContractFactory>(
    "SwapContractFactory",
    deployer
  )

  // const SatiToken = await ethers.getContract<SatiToken>("SatiToken", deployer)

  // const satiSupplyPerLiquiditySwap = calculateSatiSupplyWithNumberOfPools(
  //   SATI_TOKEN_SUPPLY.total,
  //   SATI_TOKEN_SUPPLY.swap,
  //   ROUGH_POOL_NUMBER
  // )

  // const swapsToSubmitToDao = [
  //   {
  //     baseToken: {
  //       name: "Matic Token",
  //       symbol: "MATIC",
  //     },
  //     quoteToken: {
  //       address: SatiToken.address,
  //     },
  //     priceFeed: {
  //       rate: "140000000",
  //     },
  //     swapContract: {
  //       pairName: "MATIC/STI",
  //       baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
  //       quoteTokenLiquidity: satiSupplyPerLiquiditySwap,
  //     },
  //   },
  // ]

  await withAwaitConfirmation(SwapContractFactory.transferOwnership(GovernanceTimeLock.address))

  // const GovernanceOrchestrator = ethers.getContract<GovernanceOrchestrator>(
  //   "GovernanceOrchestrator",
  //   deployer
  // )
}

daoLikeAddSwapPair.tags = ["all", "swap", "governance"]

export default daoLikeAddSwapPair
