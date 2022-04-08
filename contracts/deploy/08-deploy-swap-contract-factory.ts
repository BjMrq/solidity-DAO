import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers, network } from "hardhat"
import { awaitDeployForBlocks } from "../helpers/variables"
import { withAwaitConfirmation } from "../helpers/chain/wait-transactions"
import { SwapContractFactory } from "../typechain-types"

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

  const SwapContractFactory = await ethers.getContract<SwapContractFactory>(
    "SwapContractFactory",
    deployer
  )

  const GovernanceTimeLock = await ethers.getContract("GovernanceTimeLock", deployer)

  await withAwaitConfirmation(SwapContractFactory.transferOwnership(GovernanceTimeLock.address))
}

deploySwapDeployFactory.tags = ["all", "swap", "sales", "governance", "SwapContractFactory"]

export default deploySwapDeployFactory
