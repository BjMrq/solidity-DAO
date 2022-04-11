import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ADDRESS_ZERO, awaitDeployForBlocks, PROPOSAL_SETTINGS } from "../helpers/variables"
import { unlessOnDevelopmentChainVerifyContract } from "../helpers/contracts/deploy"
import { withAwaitConfirmation } from "../helpers/chain/wait-transactions"
import { ethers } from "hardhat"
import { GovernanceTimeLock } from "../typechain-types"

const deployGovernanceOrchestrator: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy, get },
  network: { name: networkName },
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const AstroToken = await get("AstroToken")

  const governanceTimeLockArguments = [PROPOSAL_SETTINGS.executionDelaySeconds, [], []]

  const GovernanceTimeLockDeployment = await deploy("GovernanceTimeLock", {
    from: deployer,
    args: governanceTimeLockArguments,
    log: true,
    waitConfirmations: awaitDeployForBlocks(networkName),
  })

  const GovernanceTimeLock = await ethers.getContract<GovernanceTimeLock>(
    "GovernanceTimeLock",
    deployer
  )

  await unlessOnDevelopmentChainVerifyContract(
    networkName,
    GovernanceTimeLock.address,
    governanceTimeLockArguments
  )

  const governorArguments = [
    AstroToken.address,
    GovernanceTimeLock.address,
    PROPOSAL_SETTINGS.votingDelayBlocks,
    PROPOSAL_SETTINGS.votingPeriodBlocks,
    PROPOSAL_SETTINGS.quorumPercentage,
  ]

  const GovernanceOrchestrator = await deploy("GovernanceOrchestrator", {
    from: deployer,
    args: governorArguments,
    log: true,
    waitConfirmations: awaitDeployForBlocks(networkName),
  })

  await unlessOnDevelopmentChainVerifyContract(
    networkName,
    GovernanceOrchestrator.address,
    governorArguments
  )

  if (GovernanceTimeLockDeployment.newlyDeployed) {
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
}

deployGovernanceOrchestrator.tags = ["all", "swap", "sales", "governance", "GovernanceOrchestrator"]
export default deployGovernanceOrchestrator
