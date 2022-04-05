import { ethers } from "hardhat"

type UnitConverterOptions = {
  hexlify?: boolean
}

export const toSmallestUnit = (
  tokenAmount: string | number,
  parseOptions = {} as UnitConverterOptions
): string => {
  const tokenNumber = ethers.utils.parseUnits(String(tokenAmount), "ether")

  return parseOptions.hexlify ? tokenNumber.toHexString() : tokenNumber.toString()
}

// export const toToken = (unitAmount: string | number): string =>
//   utils.formatEther(BigNumber.from(String(unitAmount)));
// .toString();
