import { network } from "hardhat"
import { PossibleNetwork } from "../types"
import { DEVELOPMENT_CHAINS } from "../variables"
import { waitForNumberOfBlocks } from "./wait-block"

export const moveChainBlocksFor = async (numberOfBlockToMoveBy: number) => {
  console.info(`Fast forwarding blocks for ${numberOfBlockToMoveBy} blocks`)

  for (let ignore of Array(numberOfBlockToMoveBy)) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    })
  }
}

export const moveChainTimeFor = async (timeInSeconds: number) => {
  console.info(`Fast forwarding time for ${timeInSeconds} seconds`)

  await network.provider.request({
    method: "evm_increaseTime",
    params: [timeInSeconds],
  })
}

export const waitForBlockOrMoveBlockIfDevelopment = async (
  currentNetwork: PossibleNetwork,
  blockNumber: number
) => {
  if (DEVELOPMENT_CHAINS.includes(currentNetwork as any)) await moveChainBlocksFor(blockNumber)
  else await waitForNumberOfBlocks(blockNumber)
}

export const waitForBlockOrMoveTimeIfDevelopment = async (
  currentNetwork: PossibleNetwork,
  blockNumber: number,
  timeToMoveInSeconds: number
) => {
  if (DEVELOPMENT_CHAINS.includes(currentNetwork as any))
    await moveChainTimeFor(timeToMoveInSeconds)
  else await waitForNumberOfBlocks(blockNumber)
}
