import { ethers } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { unlessOnDevelopmentChainVerifyContract } from "../helpers/contracts/deploy"
import { toSmallestUnit } from "../helpers/tokens/utils"
import { ASTRO_TOKEN_SUPPLY, awaitDeployForBlocks } from "../helpers/variables"

const deployAstroStake: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
  network: { name: networkName },
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const AstroToken = await ethers.getContract("AstroToken", deployer)

  const astroStakeArguments = [AstroToken.address, 60, 5]

  const AstroStakeDeployment = await deploy("AstroStake", {
    from: deployer,
    args: astroStakeArguments,
    log: true,
    waitConfirmations: awaitDeployForBlocks(networkName),
  })

  await unlessOnDevelopmentChainVerifyContract(
    networkName,
    AstroStakeDeployment.address,
    astroStakeArguments
  )

  if (AstroStakeDeployment.newlyDeployed)
    await AstroToken.transfer(
      AstroStakeDeployment.address,
      toSmallestUnit(ASTRO_TOKEN_SUPPLY.stake)
    )
}

deployAstroStake.tags = ["all", "stake", "AstroStake"]

export default deployAstroStake
