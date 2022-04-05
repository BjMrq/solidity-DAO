import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers, network } from "hardhat"
import { awaitDeployForBlocks, SATI_TOKEN_SUPPLY } from "../helpers/variables"
import { toSmallestUnit } from "../helpers/tokens/utils"

const deploySatiTokenSale: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const SatiToken = await ethers.getContract("SatiToken", deployer)

  const KYCValidation = await deploy("KYCValidation", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: awaitDeployForBlocks(network.name),
  })

  const SatiTokenSale = await deploy("SatiTokenSale", {
    from: deployer,
    args: [3000, deployer, SatiToken.address, KYCValidation.address],
    log: true,
    waitConfirmations: awaitDeployForBlocks(network.name),
  })

  await SatiToken.transfer(SatiTokenSale.address, toSmallestUnit(SATI_TOKEN_SUPPLY.sale))
}

deploySatiTokenSale.tags = ["all", "sales", "KYCValidation", "SatiTokenSale"]
export default deploySatiTokenSale
