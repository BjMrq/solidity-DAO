import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"
import { GovernanceTimeLock } from "../typechain-types/contracts/GovernanceTimeLock"
import { GovernanceOrchestrator } from "../typechain-types/contracts/GovernanceOrchestrator"
import { ADDRESS_ZERO } from "../helpers/variables"
import { withAwaitConfirmation } from "../helpers/chain/wait-transactions"

const setupGovernance: DeployFunction = async ({ getNamedAccounts }: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const GovernanceTimeLock = await ethers.getContract<GovernanceTimeLock>(
    "GovernanceTimeLock",
    deployer
  )
  const GovernanceOrchestrator = await ethers.getContract<GovernanceOrchestrator>(
    "GovernanceOrchestrator",
    deployer
  )

  await withAwaitConfirmation(
    GovernanceTimeLock.grantRole(
      await GovernanceTimeLock.PROPOSER_ROLE(),
      GovernanceOrchestrator.address
    )
  )
  await withAwaitConfirmation(
    GovernanceTimeLock.grantRole(await GovernanceTimeLock.EXECUTOR_ROLE(), ADDRESS_ZERO)
  )

  await withAwaitConfirmation(
    GovernanceTimeLock.revokeRole(await GovernanceTimeLock.TIMELOCK_ADMIN_ROLE(), deployer)
  )
}

setupGovernance.tags = ["all", "swap", "governance"]

export default setupGovernance
