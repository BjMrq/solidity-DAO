import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { network } from "hardhat"
import { awaitDeployForBlocks } from "../helpers/variables"

const deploySwapDeployFactory: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  await deploy("SwapContractFactory", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: awaitDeployForBlocks(network.name),
  })
}

deploySwapDeployFactory.tags = ["all", "swap", "sales", "governance", "SwapContractFactory"]

export default deploySwapDeployFactory
