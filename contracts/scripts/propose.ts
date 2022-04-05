import { ethers } from "hardhat"
import { executeScriptWith } from "./helpers/execute-script"
import { GovernanceOrchestrator, ColorBox } from "../typechain-types"
import { withAwaitConfirmation } from "../helpers/chain/wait-transactions"
import { buildDescriptionWithFunctionDetails } from "./helpers/build-description"

export const proposeNewColorForTheBox = async (
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

  const proposalReceipt = await withAwaitConfirmation(
    GovernanceOrchestrator.propose(
      [ColorBox.address],
      [0],
      [encodedFunctionToCall],
      buildDescriptionWithFunctionDetails(
        ColorBox,
        functionNameToExecute,
        [argumentToExecuteFunctionWith],
        proposalDescription
      )
    )
  )

  console.log(
    argumentToExecuteFunctionWith,
    //@ts-expect-error
    proposalReceipt.events[0].args.proposalId.toString()
  )
}

executeScriptWith(
  proposeNewColorForTheBox(
    "changeColor",
    `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    `This color is far greater than any other`
  )
)
