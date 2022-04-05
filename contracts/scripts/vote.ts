import { ethers } from "hardhat"
import { executeScriptWith } from "./helpers/execute-script"
import { GovernanceOrchestrator } from "../typechain-types"
import { POSSIBLE_VOTE_VALUES, PROPOSAL_SETTINGS } from "../helpers/variables"
import { withAwaitConfirmation } from "../helpers/chain/wait-transactions"
import { moveChainBlocksFor } from "../helpers/chain/move-blocks"

export const voteForProposal = async (proposalId: string) => {
  const GovernanceOrchestrator = await ethers.getContract<GovernanceOrchestrator>(
    "GovernanceOrchestrator"
  )
  // await moveChainBlocksFor(PROPOSAL_SETTINGS.votingDelayBlocks)

  await withAwaitConfirmation(
    GovernanceOrchestrator.castVoteWithReason(
      proposalId,
      POSSIBLE_VOTE_VALUES.for,
      "That is so true"
    )
  )

  // await moveChainBlocksFor(PROPOSAL_SETTINGS.votingPeriodBlocks)
}

executeScriptWith(
  voteForProposal("15311480070549959367960173256366787213153321373166463214597725339683154880506")
)
