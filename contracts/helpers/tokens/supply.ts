import { toSmallestUnit } from "./utils"

export const calculateAstroSupplyWithNumberOfPools = (
  totalSupply: string,
  totalSwapSupply: string,
  numberOfPools: number
) => toSmallestUnit((Number(totalSupply) - Number(totalSwapSupply)) / numberOfPools / 20)
