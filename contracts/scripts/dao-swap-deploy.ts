import { ethers, getNamedAccounts } from "hardhat"
import { executeScriptWith } from "./helpers/execute-script"
import { GovernanceOrchestrator, AstroToken, SwapContractFactory } from "../typechain-types"
import {
  MOCK_ERC20_SWAP_SUPPLY,
  ROUGH_POOL_NUMBER,
  ASTRO_TOKEN_SUPPLY,
  PROPOSAL_SETTINGS,
} from "../helpers/variables"
import { calculateAstroSupplyWithNumberOfPools } from "../helpers/tokens/supply"
import { getContractsBeforeSwapDeploy } from "../helpers/contracts/deploy"
import { moveChainBlocksFor, moveChainTimeFor } from "../helpers/chain/move-blocks"
import { asyncSequentialMap } from "../helpers/processing"
import {
  proposeNewSwapContractDeployment,
  voteForProposal,
  queueProposal,
  executeProposal,
} from "../helpers/contracts/propose-swap-dao"

export const proposeSwapContractDeploy = async () => {
  const { deployer } = await getNamedAccounts()

  const GovernanceOrchestrator = await ethers.getContract<GovernanceOrchestrator>(
    "GovernanceOrchestrator"
  )

  const SwapContractFactory = await ethers.getContract<SwapContractFactory>(
    "SwapContractFactory",
    deployer
  )

  const AstroToken = await ethers.getContract<AstroToken>("AstroToken", deployer)

  const astroSupplyPerLiquiditySwap = calculateAstroSupplyWithNumberOfPools(
    ASTRO_TOKEN_SUPPLY.total,
    ASTRO_TOKEN_SUPPLY.swap,
    ROUGH_POOL_NUMBER
  )

  const swapsToSubmitToDao = [
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
  ]

  //Get tokens contract or deploy mocks (we use reduce to execute transaction once at a time)
  const swapPoolsWithTokenContract = await asyncSequentialMap(
    swapsToSubmitToDao,
    getContractsBeforeSwapDeploy
  )

  //Deploy swap contracts with DAO
  const proposals = await asyncSequentialMap(
    swapPoolsWithTokenContract,
    proposeNewSwapContractDeployment(SwapContractFactory, GovernanceOrchestrator)
  )

  await moveChainBlocksFor(PROPOSAL_SETTINGS.votingDelayBlocks)

  await asyncSequentialMap(proposals, voteForProposal(GovernanceOrchestrator))

  await moveChainBlocksFor(PROPOSAL_SETTINGS.votingPeriodBlocks)

  await asyncSequentialMap(proposals, queueProposal(SwapContractFactory, GovernanceOrchestrator))

  await moveChainTimeFor(PROPOSAL_SETTINGS.executionDelayMinutes + 10)
  // await moveChainBlocksFor(2)

  await asyncSequentialMap(proposals, executeProposal(SwapContractFactory, GovernanceOrchestrator))

  console.log(await (await GovernanceOrchestrator.getAllProposalsId()).toString())
}

executeScriptWith(proposeSwapContractDeploy())
