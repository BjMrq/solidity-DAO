import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers, network } from "hardhat"
import { awaitDeployForBlocks, ASTRO_TOKEN_SUPPLY } from "../helpers/variables"
import { toSmallestUnit } from "../helpers/tokens/utils"

const deployAstroTokenSale: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const AstroToken = await ethers.getContract("AstroToken", deployer)

  const KYCValidation = await deploy("KYCValidation", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: awaitDeployForBlocks(network.name),
  })

  const AstroTokenSale = await deploy("AstroTokenSale", {
    from: deployer,
    args: [3000, deployer, AstroToken.address, KYCValidation.address],
    log: true,
    waitConfirmations: awaitDeployForBlocks(network.name),
  })

  await AstroToken.transfer(AstroTokenSale.address, toSmallestUnit(ASTRO_TOKEN_SUPPLY.sale))
}

deployAstroTokenSale.tags = ["all", "sales", "KYCValidation", "AstroTokenSale"]
export default deployAstroTokenSale
