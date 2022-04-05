import { Contract } from "ethers"
import { ethers } from "hardhat"

export const deployNewContract = async <TContract extends Contract>(contractName: string) => {
  const Contract = await ethers.getContractFactory(contractName)

  return (await Contract.deploy()) as TContract
}
