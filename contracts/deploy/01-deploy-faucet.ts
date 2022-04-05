import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { network } from "hardhat"
import { awaitDeployForBlocks, NETWORK_CONFIG } from "../helpers/variables"

const deployFaucet: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  await deploy("Faucet", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: awaitDeployForBlocks(network.name),
  })
}

deployFaucet.tags = ["all", "Faucet"]
export default deployFaucet
