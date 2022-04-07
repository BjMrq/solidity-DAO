import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { awaitDeployForBlocks, NETWORK_CONFIG, ASTRO_TOKEN_SUPPLY } from "../helpers/variables"
import { ethers, network } from "hardhat"
import { toSmallestUnit } from "../helpers/tokens/utils"

const delegateVote = async (astroTokenAddress: string, delegatedAccount: string) => {
  const astroToken = await ethers.getContractAt("AstroToken", astroTokenAddress)

  ;(await astroToken.delegate(delegatedAccount)).wait(1)
}

const deployAstroToken: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const astroToken = await deploy("AstroToken", {
    from: deployer,
    args: [toSmallestUnit(ASTRO_TOKEN_SUPPLY.total)],
    log: true,
    waitConfirmations: awaitDeployForBlocks(network.name),
  })

  await delegateVote(astroToken.address, deployer)

  // if (!DEVELOPMENT_CHAINS.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  //   await verify(governanceToken.address, [])
  // }
}

deployAstroToken.tags = ["all", "sales", "swap", "governance", "AstroToken"]
export default deployAstroToken
