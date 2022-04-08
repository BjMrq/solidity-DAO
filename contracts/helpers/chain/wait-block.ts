import { ethers } from "hardhat"

export const sleep = (millisecondToSleepFor: number) =>
  new Promise((resolve) => setTimeout(resolve, millisecondToSleepFor))

export const waitForTime = async (executionEta: number) => {
  let currentTime = Math.round(new Date().getTime() / 1000)

  while (currentTime < executionEta) {
    await sleep(4000)
    currentTime = Math.round(new Date().getTime() / 1000)
  }

  return true
}

export const waitForBlockNumber = async (blockNumber: number) => {
  let currentBlockNumber = await ethers.provider.getBlockNumber()

  while (currentBlockNumber < blockNumber) {
    console.info(`Current block is ${currentBlockNumber} waiting until block ${blockNumber}`)
    await sleep(4000)
    currentBlockNumber = await ethers.provider.getBlockNumber()
  }

  return currentBlockNumber
}

export const waitForNumberOfBlocks = async (numberOfBlockToWaitFor: number) => {
  let currentBlockNumber = await ethers.provider.getBlockNumber()
  const stopWaitBlockNumber = currentBlockNumber + numberOfBlockToWaitFor

  while (currentBlockNumber < stopWaitBlockNumber) {
    console.info(
      `Current block is ${currentBlockNumber} waiting until block ${stopWaitBlockNumber}`
    )
    await sleep(4000)
    currentBlockNumber = await ethers.provider.getBlockNumber()
  }

  return currentBlockNumber
}
