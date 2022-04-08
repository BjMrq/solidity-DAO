import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { getContractsBeforeSwapDeploy } from "../helpers/contracts/deploy"
import { PossibleNetwork, PreSwapDeployPerNetwork, SwapTokenAddressInfo } from "../helpers/types"
import { ethers } from "hardhat"
import { AstroToken, GovernanceOrchestrator, SwapContractFactory } from "../typechain-types"
import {
  MOCK_ERC20_SWAP_SUPPLY,
  ROUGH_POOL_NUMBER,
  ASTRO_TOKEN_SUPPLY,
  PROPOSAL_SETTINGS,
  DEVELOPMENT_CHAINS,
} from "../helpers/variables"
import { calculateAstroSupplyWithNumberOfPools } from "../helpers/tokens/supply"
import { asyncSequentialMap } from "../helpers/processing"
import { moveChainBlocksFor, moveChainTimeFor } from "../helpers/chain/move-blocks"

import { waitForNumberOfBlocks } from "../helpers/chain/wait-block"
import {
  proposeNewSwapContractDeployment,
  voteForProposal,
  queueProposal,
  executeProposal,
} from "../helpers/contracts/propose-swap-dao"

const waitForBlockOrMoveBlockIfDevelopment = async (
  isDevelopmentNetwork: boolean,
  blockNumber: number
) => {
  if (isDevelopmentNetwork) await moveChainBlocksFor(blockNumber)
  else await waitForNumberOfBlocks(blockNumber)
}

const daoLikeAddSwapPair: DeployFunction = async ({
  getNamedAccounts,
  network,
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const AstroToken = await ethers.getContract<AstroToken>("AstroToken", deployer)

  const GovernanceOrchestrator = await ethers.getContract<GovernanceOrchestrator>(
    "GovernanceOrchestrator"
  )
  const SwapContractFactory = await ethers.getContract<SwapContractFactory>(
    "SwapContractFactory",
    deployer
  )

  const astroSupplyPerLiquiditySwap = calculateAstroSupplyWithNumberOfPools(
    ASTRO_TOKEN_SUPPLY.total,
    ASTRO_TOKEN_SUPPLY.swap,
    ROUGH_POOL_NUMBER
  )

  const swapPools = {
    localhost: [],
    hardhat: [
      {
        baseToken: {
          name: "Basic Attention Token",
          symbol: "BAT",
        },
        quoteToken: {
          address: AstroToken.address,
        },
        priceFeed: {
          rate: "80000000",
        },
        swapContract: {
          pairName: "BAT/ASTRO",
          baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
          quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
        },
      },
      {
        baseToken: {
          name: "BNB",
          symbol: "BNB",
        },
        quoteToken: {
          address: AstroToken.address,
        },
        priceFeed: {
          rate: "38400000000",
        },
        swapContract: {
          pairName: "BNB/ASTRO",
          baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
          quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
        },
      },
      {
        baseToken: {
          name: "USD Coin",
          symbol: "USDC",
        },
        quoteToken: {
          address: AstroToken.address,
        },
        priceFeed: {
          rate: "100000000",
        },
        swapContract: {
          pairName: "USDC/ASTRO",
          baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
          quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
        },
      },
      {
        baseToken: {
          name: "Wrapped BTC",
          symbol: "WBTC",
        },
        quoteToken: {
          address: AstroToken.address,
        },
        priceFeed: {
          rate: "4100000000000",
        },
        swapContract: {
          pairName: "WBTC/ASTRO",
          baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
          quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
        },
      },
      {
        baseToken: {
          name: "Dai Stablecoin",
          symbol: "DAI",
        },
        quoteToken: {
          address: AstroToken.address,
        },
        priceFeed: {
          rate: "100000000",
        },
        swapContract: {
          pairName: "DAI/ASTRO",
          baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
          quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
        },
      },
      {
        baseToken: {
          name: "ChainLink Token",
          symbol: "LINK",
        },
        quoteToken: {
          address: AstroToken.address,
        },
        priceFeed: {
          rate: "1500000000",
        },
        swapContract: {
          pairName: "LINK/ASTRO",
          baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
          quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
        },
      },
      {
        baseToken: {
          name: "Wrapped Litecoin",
          symbol: "WLTC",
        },
        quoteToken: {
          address: AstroToken.address,
        },
        priceFeed: {
          rate: "11000000000",
        },
        swapContract: {
          pairName: "WLTC/ASTRO",
          baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
          quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
        },
      },
      {
        baseToken: {
          name: "Matic Token",
          symbol: "MATIC",
        },
        quoteToken: {
          address: AstroToken.address,
        },
        priceFeed: {
          rate: "140000000",
        },
        swapContract: {
          pairName: "MATIC/ASTRO",
          baseTokenLiquidity: MOCK_ERC20_SWAP_SUPPLY,
          quoteTokenLiquidity: astroSupplyPerLiquiditySwap,
        },
      },
    ],
    rinkeby: [],
  } as PreSwapDeployPerNetwork

  const currentNetwork = network.name as PossibleNetwork

  const swapPoolsToSubmitToDao = swapPools[currentNetwork]

  const isDevelopmentNetwork = DEVELOPMENT_CHAINS.includes(currentNetwork as any)

  //Get tokens contract or deploy mocks (we use reduce to execute transaction once at a time)
  const swapPoolsWithTokenContract = await asyncSequentialMap(
    swapPoolsToSubmitToDao,
    getContractsBeforeSwapDeploy
  )

  //Deploy swap contracts with DAO
  const proposals = await asyncSequentialMap(
    swapPoolsWithTokenContract,
    proposeNewSwapContractDeployment(SwapContractFactory, GovernanceOrchestrator)
  )

  await waitForBlockOrMoveBlockIfDevelopment(
    isDevelopmentNetwork,
    PROPOSAL_SETTINGS.votingDelayBlocks
  )

  await asyncSequentialMap(proposals, voteForProposal(GovernanceOrchestrator))

  await waitForBlockOrMoveBlockIfDevelopment(
    isDevelopmentNetwork,
    PROPOSAL_SETTINGS.votingPeriodBlocks
  )

  await asyncSequentialMap(proposals, queueProposal(SwapContractFactory, GovernanceOrchestrator))

  if (isDevelopmentNetwork) await moveChainTimeFor(PROPOSAL_SETTINGS.executionDelaySeconds + 10)
  else await waitForNumberOfBlocks(4)

  await asyncSequentialMap(proposals, executeProposal(SwapContractFactory, GovernanceOrchestrator))
}

daoLikeAddSwapPair.tags = ["all", "swap", "governance"]

export default daoLikeAddSwapPair
