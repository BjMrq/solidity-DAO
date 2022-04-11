import { ethers } from "hardhat"
import { ERC20, SwapContractFactory } from "../../typechain-types"
import { SwapDeployTokenInfo } from "../types"

export const foundAddressWith = async (
  tokenInstance: ERC20,
  {
    addressToFound,
    amount,
  }: {
    addressToFound: string
    amount: number | string
  }
) => {
  const { deployer } = await ethers.getNamedSigners()
  await tokenInstance.connect(deployer).transfer(addressToFound, amount)
}

export const supplyLiquidityForSwapContracts =
  (SwapContractFactory: SwapContractFactory) =>
  async ({
    baseToken,
    quoteToken,
    swapContract: { pairName, quoteTokenLiquidity, baseTokenLiquidity },
  }: SwapDeployTokenInfo) => {
    const { swapContractAddress } = await SwapContractFactory.deployedSwapContractsRegistry(
      pairName
    )

    await baseToken.contract.transfer(swapContractAddress, baseTokenLiquidity)
    await quoteToken.contract.transfer(swapContractAddress, quoteTokenLiquidity)
  }

export const sendTokensFromERC20ContractAddress = async (
  erc20ContractAddress: string,
  addressToTransferTo: string,
  amountToTransfer: string
) =>
  (await ethers.getContractAt("ERC20", erc20ContractAddress)).transfer(
    addressToTransferTo,
    amountToTransfer
  )

export const supplyChainLinkTokenForPriceFeedUsage =
  (SwapContractFactory: SwapContractFactory, chainLinkContract: ERC20, linkAmount: string) =>
  async ({ swapContract: { pairName } }: SwapDeployTokenInfo) => {
    const { swapContractAddress } = await SwapContractFactory.deployedSwapContractsRegistry(
      pairName
    )

    await chainLinkContract.transfer(swapContractAddress, linkAmount)
  }
