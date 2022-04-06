import { executeScriptWith } from "./helpers/execute-script"
import { GovernanceOrchestrator, SatiToken } from "../typechain-types"
import { POSSIBLE_VOTE_VALUES, PROPOSAL_SETTINGS } from "../helpers/variables"
import { withAwaitConfirmation } from "../helpers/chain/wait-transactions"
import { moveChainBlocksFor } from "../helpers/chain/move-blocks"
import { ethers } from "hardhat"
import { NamedSigners } from "../helpers/types"
import { foundAddressWith } from "../helpers/tokens/founding"
import { toSmallestUnit } from "../helpers/tokens/utils"

export const voteForProposal = async (proposalId: string) => {
  const { satiBuyer } = (await ethers.getNamedSigners()) as NamedSigners

  const SatiToken = await ethers.getContract<SatiToken>("SatiToken")

  await foundAddressWith(SatiToken, {
    addressToFound: satiBuyer.address,
    amount: toSmallestUnit("80"),
  })

  const GovernanceOrchestrator = await ethers.getContract<GovernanceOrchestrator>(
    "GovernanceOrchestrator"
  )
  // await moveChainBlocksFor(PROPOSAL_SETTINGS.votingDelayBlocks)

  await withAwaitConfirmation(
    GovernanceOrchestrator.connect(satiBuyer).castVoteWithReason(
      proposalId,
      POSSIBLE_VOTE_VALUES.for,
      "That is so true"
    )
  )

  // await moveChainBlocksFor(PROPOSAL_SETTINGS.votingPeriodBlocks)
}

executeScriptWith(
  voteForProposal("91012722560177314863868403158046091205895143832940190610089431000320151963387")
)
