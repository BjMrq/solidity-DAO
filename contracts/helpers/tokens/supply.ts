import { toSmallestUnit } from "./utils"

export const calculateSatiSupplyWithNumberOfPools = (
  totalSupply: string,
  totalSwapSupply: string,
  numberOfPools: number
) => toSmallestUnit((Number(totalSupply) - Number(totalSwapSupply)) / numberOfPools / 20)
