import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { awaitDeployForBlocks, PROPOSAL_SETTINGS } from "../helpers/variables"
import { network } from "hardhat"

const deployGovernanceOrchestrator: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy, get },
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const SatiToken = await get("SatiToken")
  const GovernanceTimeLock = await get("GovernanceTimeLock")

  await deploy("GovernanceOrchestrator", {
    from: deployer,
    args: [
      SatiToken.address,
      GovernanceTimeLock.address,
      PROPOSAL_SETTINGS.votingDelayBlocks,
      PROPOSAL_SETTINGS.votingPeriodBlocks,
      PROPOSAL_SETTINGS.quorumPercentage,
    ],
    log: true,
    waitConfirmations: awaitDeployForBlocks(network.name),
  })
}

deployGovernanceOrchestrator.tags = ["all", "governance", "GovernanceOrchestrator"]
export default deployGovernanceOrchestrator
