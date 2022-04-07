import { ethers, getNamedAccounts } from "hardhat"
import { executeScriptWith } from "./helpers/execute-script"
import { GovernanceOrchestrator, AstroToken, SwapContractFactory } from "../typechain-types"
import {
  MOCK_ERC20_SWAP_SUPPLY,
  POSSIBLE_VOTE_VALUES,
  ROUGH_POOL_NUMBER,
  ASTRO_TOKEN_SUPPLY,
  PROPOSAL_SETTINGS,
} from "../helpers/variables"
import { withAwaitConfirmation } from "../helpers/chain/wait-transactions"
import { calculateAstroSupplyWithNumberOfPools } from "../helpers/tokens/supply"
import { getContractsBeforeSwapDeploy } from "../helpers/contracts/deploy"
import { SwapDeployTokenInfo } from "../helpers/types"
import { moveChainBlocksFor, moveChainTimeFor } from "../helpers/chain/move-blocks"
import { asyncSequentialMap } from "../helpers/processing"
import { buildDescriptionWithFunctionDetails } from "./helpers/build-description"

type ProposedSwapInfo = {
  proposalId: string
  encodedDeployNewSwapFunctionToCall: string
  proposalDescription: string
}

export const proposeNewSwapContractDeployment =
  (SwapContractFactory: SwapContractFactory, GovernanceOrchestrator: GovernanceOrchestrator) =>
  async ({
    baseToken,
    quoteToken,
    priceFeed,
    swapContract: { pairName },
  }: SwapDeployTokenInfo): Promise<ProposedSwapInfo> => {
    const functionCallInfo = {
      functionName: "deployNewSwapContract",
      functionArguments: [
        baseToken.contract.address,
        quoteToken.contract.address,
        priceFeed.address,
      ],
    } as const

    const encodedDeployNewSwapFunctionToCall = SwapContractFactory.interface.encodeFunctionData(
      //@ts-expect-error pattern matching seem broken here
      functionCallInfo.functionName,
      functionCallInfo.functionArguments
    )

    const proposalDescription = buildDescriptionWithFunctionDetails(
      SwapContractFactory,
      functionCallInfo.functionName,
      functionCallInfo.functionArguments,
      `Allowing to swap ${pairName} will allow more accessibility to the ASTRO token`
    )

    //@ts-expect-error some accessors are maybe undefined
    const proposalId = (
      await withAwaitConfirmation(
        GovernanceOrchestrator.propose(
          [SwapContractFactory.address],
          [0],
          [encodedDeployNewSwapFunctionToCall],
          proposalDescription
        )
      )
    ).events[0].args.proposalId.toString() as string

    return {
      proposalId,
      encodedDeployNewSwapFunctionToCall,
      proposalDescription,
    }
  }

const voteForProposition =
  (GovernanceOrchestrator: GovernanceOrchestrator) =>
  async ({ proposalId }: ProposedSwapInfo) =>
    await withAwaitConfirmation(
      GovernanceOrchestrator.castVoteWithReason(
        proposalId,
        POSSIBLE_VOTE_VALUES.for,
        "We should definitely do that"
      )
    )

const queueProposition =
  (SwapContractFactory: SwapContractFactory, GovernanceOrchestrator: GovernanceOrchestrator) =>
  async ({ encodedDeployNewSwapFunctionToCall, proposalDescription }: ProposedSwapInfo) =>
    await withAwaitConfirmation(
      GovernanceOrchestrator.queue(
        [SwapContractFactory.address],
        [0],
        [encodedDeployNewSwapFunctionToCall],
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes(proposalDescription))
      )
    )

const executeProposition =
  (SwapContractFactory: SwapContractFactory, GovernanceOrchestrator: GovernanceOrchestrator) =>
  async ({ encodedDeployNewSwapFunctionToCall, proposalDescription }: ProposedSwapInfo) =>
    await withAwaitConfirmation(
      GovernanceOrchestrator.execute(
        [SwapContractFactory.address],
        [0],
        [encodedDeployNewSwapFunctionToCall],
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes(proposalDescription))
      )
    )

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
  const propositions = await asyncSequentialMap(
    swapPoolsWithTokenContract,
    proposeNewSwapContractDeployment(SwapContractFactory, GovernanceOrchestrator)
  )

  await moveChainBlocksFor(PROPOSAL_SETTINGS.votingDelayBlocks)

  await asyncSequentialMap(propositions, voteForProposition(GovernanceOrchestrator))

  await moveChainBlocksFor(PROPOSAL_SETTINGS.votingPeriodBlocks)

  await asyncSequentialMap(
    propositions,
    queueProposition(SwapContractFactory, GovernanceOrchestrator)
  )

  await moveChainTimeFor(PROPOSAL_SETTINGS.executionDelaySeconds + 10)
  // await moveChainBlocksFor(2)

  await asyncSequentialMap(
    propositions,
    executeProposition(SwapContractFactory, GovernanceOrchestrator)
  )

  console.log(await (await GovernanceOrchestrator.getAllProposalsId()).toString())
}

executeScriptWith(proposeSwapContractDeploy())
