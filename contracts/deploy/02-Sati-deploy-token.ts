import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { awaitDeployForBlocks, NETWORK_CONFIG, SATI_TOKEN_SUPPLY } from "../helpers/variables"
import { ethers, network } from "hardhat"
import { toSmallestUnit } from "../helpers/tokens/utils"

const delegateVote = async (satiTokenAddress: string, delegatedAccount: string) => {
  const satiToken = await ethers.getContractAt("SatiToken", satiTokenAddress)

  ;(await satiToken.delegate(delegatedAccount)).wait(1)
}

const deploySatiToken: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
}: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()

  const satiToken = await deploy("SatiToken", {
    from: deployer,
    args: [toSmallestUnit(SATI_TOKEN_SUPPLY.total)],
    log: true,
    waitConfirmations: awaitDeployForBlocks(network.name),
  })

  await delegateVote(satiToken.address, deployer)

  // if (!DEVELOPMENT_CHAINS.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  //   await verify(governanceToken.address, [])
  // }
}

deploySatiToken.tags = ["all", "sales", "swap", "governance", "SatiToken"]
export default deploySatiToken
