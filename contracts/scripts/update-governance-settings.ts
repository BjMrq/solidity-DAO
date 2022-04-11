import { ethers } from "hardhat"
import { GovernanceTimeLock } from "../typechain-types"
import { executeScriptWith } from "./helpers/execute-script"

export const updateGovernanceSettings = async () => {
  const GovernanceTimeLock = await ethers.getContract<GovernanceTimeLock>("GovernanceTimeLock")

  GovernanceTimeLock.connect(GovernanceTimeLock.address).updateDelay(10)
}

executeScriptWith(updateGovernanceSettings())
