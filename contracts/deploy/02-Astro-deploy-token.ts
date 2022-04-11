import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { awaitDeployForBlocks, NETWORK_CONFIG, ASTRO_TOKEN_SUPPLY } from "../helpers/variables"
import { ethers } from "hardhat"
import { toSmallestUnit } from "../helpers/tokens/utils"
import { unlessOnDevelopmentChainVerifyContract } from "../helpers/contracts/deploy"

const delegateVote = async (astroTokenAddress: string, delegatedAccount: string) => {
  const astroToken = await ethers.getContractAt("AstroToken", astroTokenAddress)

  ;(await astroToken.delegate(delegatedAccount)).wait(1)
}

const deployAstroToken: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
  network: { name: networkName },
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const astroTokenArguments = [toSmallestUnit(ASTRO_TOKEN_SUPPLY.total)]

  const AstroToken = await deploy("AstroToken", {
    from: deployer,
    args: astroTokenArguments,
    log: true,
    waitConfirmations: awaitDeployForBlocks(networkName),
  })

  if (AstroToken.newlyDeployed) await delegateVote(AstroToken.address, deployer)

  await unlessOnDevelopmentChainVerifyContract(networkName, AstroToken.address, astroTokenArguments)
}

deployAstroToken.tags = ["all", "stake", "sales", "swap", "governance", "AstroToken"]
export default deployAstroToken
