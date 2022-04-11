import { ethers, getNamedAccounts } from "hardhat"
import { asyncSequentialMap } from "../helpers/processing"
import { supplyChainLinkTokenForPriceFeedUsage } from "../helpers/tokens/founding"
import { toSmallestUnit } from "../helpers/tokens/utils"
import { SwapDeployTokenInfo } from "../helpers/types"
import { ERC20, SwapContractFactory } from "../typechain-types"
import { executeScriptWith } from "./helpers/execute-script"

export const sendTokenToContract = async () => {
  const { deployer } = await getNamedAccounts()

  const chainLinkContract = await ethers.getContractAt<ERC20>(
    "ERC20",
    "0x01BE23585060835E02B77ef475b0Cc51aA1e0709"
  )

  const SwapContractFactory = await ethers.getContract<SwapContractFactory>(
    "SwapContractFactory",
    deployer
  )

  const swapPairs = (await SwapContractFactory.getAllSwapPairs()).map((pairName) => ({
    swapContract: { pairName },
  }))

  const chainLinkPerContract = (await chainLinkContract.balanceOf(deployer))
    .sub(toSmallestUnit("10"))
    .div(swapPairs.length)
    .toString()

  console.log(chainLinkPerContract)

  await asyncSequentialMap(
    swapPairs as unknown as SwapDeployTokenInfo[],
    supplyChainLinkTokenForPriceFeedUsage(
      SwapContractFactory,
      chainLinkContract,
      chainLinkPerContract
    )
  )
}

executeScriptWith(sendTokenToContract())
