import { ethers } from "hardhat"
import { withAwaitConfirmation } from "../helpers/chain/wait-transactions"
import { GovernanceOrchestrator, GovernanceTimeLock } from "../typechain-types"
import { buildDescriptionWithFunctionDetails } from "./helpers/build-description"
import { executeScriptWith } from "./helpers/execute-script"

export const updateGovernanceSettings = async <TArgument extends number | string>(
  functionNameToExecute: any,
  argumentToExecuteFunctionWith: TArgument,
  proposalDescription: string
) => {
  const GovernanceOrchestrator = await ethers.getContract<GovernanceOrchestrator>(
    "GovernanceOrchestrator"
  )

  const GovernanceTimeLock = await ethers.getContract<GovernanceTimeLock>("GovernanceTimeLock")

  const encodedFunctionToCall = GovernanceTimeLock.interface.encodeFunctionData(
    functionNameToExecute,
    [argumentToExecuteFunctionWith]
  )

  await withAwaitConfirmation(
    GovernanceOrchestrator.propose(
      [GovernanceTimeLock.address],
      [0],
      [encodedFunctionToCall],
      buildDescriptionWithFunctionDetails(
        GovernanceTimeLock,
        functionNameToExecute,
        [argumentToExecuteFunctionWith],
        proposalDescription
      )
    )
  )
}

executeScriptWith(
  updateGovernanceSettings(
    "updateDelay",
    15,
    "Adding more delay before the execution of the proposal to demonstrate grace period where DAO participant can exit they they disagree with the vote result"
  )
)
