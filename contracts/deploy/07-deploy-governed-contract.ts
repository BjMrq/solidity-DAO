import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"
import { ColorBox } from "../typechain-types"
import { withAwaitConfirmation } from "../helpers/chain/wait-transactions"
import { awaitDeployForBlocks } from "../helpers/variables"
import { unlessOnDevelopmentChainVerifyContract } from "../helpers/contracts/deploy"

const deployGovernedContract: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
  network: { name: networkName },
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const colorBoxArguments = ["#6038ca"]

  const ColorBoxDeployment = await deploy("ColorBox", {
    from: deployer,
    args: colorBoxArguments,
    log: true,
    waitConfirmations: awaitDeployForBlocks(networkName),
  })

  if (ColorBoxDeployment.newlyDeployed) {
    const ColorBox = await ethers.getContractAt<ColorBox>("ColorBox", ColorBoxDeployment.address)

    await unlessOnDevelopmentChainVerifyContract(networkName, ColorBox.address, colorBoxArguments)

    const GovernanceTimeLock = ethers.getContract("GovernanceTimeLock", deployer)

    await withAwaitConfirmation(ColorBox.transferOwnership((await GovernanceTimeLock).address))
  }
}

deployGovernedContract.tags = ["all", "swap", "governance", "SwapContractFactory", "ColorBox"]

export default deployGovernedContract
