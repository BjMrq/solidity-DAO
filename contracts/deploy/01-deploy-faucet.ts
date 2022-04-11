import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { awaitDeployForBlocks } from "../helpers/variables"
import { unlessOnDevelopmentChainVerifyContract } from "../helpers/contracts/deploy"

const deployFaucet: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
  network: { name: networkName },
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const Faucet = await deploy("Faucet", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: awaitDeployForBlocks(networkName),
  })

  await unlessOnDevelopmentChainVerifyContract(networkName, Faucet.address)
}

deployFaucet.tags = ["all", "Faucet"]
export default deployFaucet
