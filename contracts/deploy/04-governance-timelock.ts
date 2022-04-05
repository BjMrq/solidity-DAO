import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { awaitDeployForBlocks, PROPOSAL_SETTINGS } from "../helpers/variables"
import { network } from "hardhat"

const deployGovernanceTimeLock: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  await deploy("GovernanceTimeLock", {
    from: deployer,
    args: [PROPOSAL_SETTINGS.executionDelaySeconds, [], []],
    log: true,
    waitConfirmations: awaitDeployForBlocks(network.name),
  })
}

deployGovernanceTimeLock.tags = ["all", "swap", "governance", "GovernanceTimeLock"]
export default deployGovernanceTimeLock
