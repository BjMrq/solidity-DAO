import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"
import { awaitDeployForBlocks } from "../helpers/variables"
import { withAwaitConfirmation } from "../helpers/chain/wait-transactions"
import { SwapContractFactory } from "../typechain-types"
import { unlessOnDevelopmentChainVerifyContract } from "../helpers/contracts/deploy"

const deploySwapDeployFactory: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
  network: { name: networkName },
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const SwapContractFactoryDeployment = await deploy("SwapContractFactory", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: awaitDeployForBlocks(networkName),
  })

  if (SwapContractFactoryDeployment.newlyDeployed) {
    const SwapContractFactory = await ethers.getContract<SwapContractFactory>(
      "SwapContractFactory",
      deployer
    )

    await unlessOnDevelopmentChainVerifyContract(networkName, SwapContractFactory.address)

    const GovernanceTimeLock = await ethers.getContract("GovernanceTimeLock", deployer)

    await withAwaitConfirmation(SwapContractFactory.transferOwnership(GovernanceTimeLock.address))
  }
}

deploySwapDeployFactory.tags = ["all", "swap", "sales", "governance", "SwapContractFactory"]

export default deploySwapDeployFactory
