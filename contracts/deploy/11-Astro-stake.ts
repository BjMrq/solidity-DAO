import { network, ethers } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { toSmallestUnit } from "../helpers/tokens/utils"
import { ASTRO_TOKEN_SUPPLY, awaitDeployForBlocks } from "../helpers/variables"

const deployAstroStake: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const AstroToken = await ethers.getContract("AstroToken", deployer)

  const AstroStakeDeployment = await deploy("AstroStake", {
    from: deployer,
    args: [AstroToken.address, 60, 5],
    log: true,
    waitConfirmations: awaitDeployForBlocks(network.name),
  })

  await AstroToken.transfer(AstroStakeDeployment.address, toSmallestUnit(ASTRO_TOKEN_SUPPLY.stake))
}

deployAstroStake.tags = ["all", "stake", "AstroStake"]

export default deployAstroStake
