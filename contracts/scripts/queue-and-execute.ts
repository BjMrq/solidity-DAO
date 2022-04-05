import { ethers } from "hardhat"
import { executeScriptWith } from "./helpers/execute-script"
import { GovernanceOrchestrator, ColorBox } from "../typechain-types"
import { PROPOSAL_SETTINGS } from "../helpers/variables"
import { moveChainBlocksFor, moveChainTimeFor } from "../helpers/chain/move-blocks"
import { withAwaitConfirmation } from "../helpers/chain/wait-transactions"
import { buildDescriptionWithFunctionDetails } from "./helpers/build-description"

export const queueAndExecuteProposal = async (
  functionNameToExecute: any,
  argumentToExecuteFunctionWith: string,
  proposalDescription: string
) => {
  const GovernanceOrchestrator = await ethers.getContract<GovernanceOrchestrator>(
    "GovernanceOrchestrator"
  )
  const ColorBox = await ethers.getContract<ColorBox>("ColorBox")

  const encodedFunctionToCall = ColorBox.interface.encodeFunctionData(functionNameToExecute, [
    argumentToExecuteFunctionWith,
  ])

  await withAwaitConfirmation(
    GovernanceOrchestrator.queue(
      [ColorBox.address],
      [0],
      [encodedFunctionToCall],
      ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(
          buildDescriptionWithFunctionDetails(
            ColorBox,
            functionNameToExecute,
            [argumentToExecuteFunctionWith],
            proposalDescription
          )
        )
      )
    )
  )

  await moveChainTimeFor(PROPOSAL_SETTINGS.executionDelaySeconds + 10)
  // await moveChainBlocksFor(1)

  await withAwaitConfirmation(
    GovernanceOrchestrator.execute(
      [ColorBox.address],
      [0],
      [encodedFunctionToCall],
      ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(
          buildDescriptionWithFunctionDetails(
            ColorBox,
            functionNameToExecute,
            [argumentToExecuteFunctionWith],
            proposalDescription
          )
        )
      )
    )
  )

  console.log(await ColorBox.getColor())
}

executeScriptWith(
  queueAndExecuteProposal("changeColor", "#f96259", `This color is far greater than any other`)
)
