import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"
import { awaitDeployForBlocks, ASTRO_TOKEN_SUPPLY } from "../helpers/variables"
import { toSmallestUnit } from "../helpers/tokens/utils"
import { unlessOnDevelopmentChainVerifyContract } from "../helpers/contracts/deploy"

const deployAstroTokenSale: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
  network: { name: networkName },
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const AstroToken = await ethers.getContract("AstroToken", deployer)

  const KYCValidation = await deploy("KYCValidation", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: awaitDeployForBlocks(networkName),
  })

  await unlessOnDevelopmentChainVerifyContract(networkName, KYCValidation.address)

  const astroTokenSaleArguments = [3000, deployer, AstroToken.address, KYCValidation.address]

  const AstroTokenSale = await deploy("AstroTokenSale", {
    from: deployer,
    args: astroTokenSaleArguments,
    log: true,
    waitConfirmations: awaitDeployForBlocks(networkName),
  })

  await unlessOnDevelopmentChainVerifyContract(
    networkName,
    AstroTokenSale.address,
    astroTokenSaleArguments
  )

  if (AstroTokenSale.newlyDeployed)
    await AstroToken.transfer(AstroTokenSale.address, toSmallestUnit(ASTRO_TOKEN_SUPPLY.sale))
}

deployAstroTokenSale.tags = ["all", "sales", "KYCValidation", "AstroTokenSale"]
export default deployAstroTokenSale
