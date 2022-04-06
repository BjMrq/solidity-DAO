import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers, network } from "hardhat"
import { ColorBox } from "../typechain-types"
import { withAwaitConfirmation } from "../helpers/chain/wait-transactions"
import { awaitDeployForBlocks } from "../helpers/variables"

const deployGovernedContract: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const ColorBox = await ethers.getContractAt<ColorBox>(
    "ColorBox",
    (
      await deploy("ColorBox", {
        from: deployer,
        args: ["#6038ca"],
        log: true,
        waitConfirmations: awaitDeployForBlocks(network.name),
      })
    ).address
  )

  const GovernanceTimeLock = ethers.getContract("GovernanceTimeLock", deployer)

  await withAwaitConfirmation(ColorBox.transferOwnership((await GovernanceTimeLock).address))
}

deployGovernedContract.tags = ["all", "swap", "governance", "SwapContractFactory", "ColorBox"]

export default deployGovernedContract
