import { ethers } from "ethers"
import { buildDescriptionWithFunctionDetails } from "../../scripts/helpers/build-description"
import { GovernanceOrchestrator, SwapContractFactory } from "../../typechain-types"
import { withAwaitConfirmation } from "../chain/wait-transactions"
import { ProposedSwapInfo, SwapDeployTokenInfo } from "../types"
import { POSSIBLE_VOTE_VALUES } from "../variables"

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

export const voteForProposal =
  (GovernanceOrchestrator: GovernanceOrchestrator) =>
  async ({ proposalId }: ProposedSwapInfo) =>
    await withAwaitConfirmation(
      GovernanceOrchestrator.castVoteWithReason(
        proposalId,
        POSSIBLE_VOTE_VALUES.for,
        "We should definitely do that"
      )
    )

export const queueProposal =
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

export const executeProposal =
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
