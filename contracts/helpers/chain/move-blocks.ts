import { network } from "hardhat";

export const moveChainBlocksFor = async (numberOfBlockToMoveBy: number) => {
  console.info(`Fast forwarding blocks for ${numberOfBlockToMoveBy} blocks`);

  for (let ignore of Array(numberOfBlockToMoveBy)) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
};

export const moveChainTimeFor = async (timeInSeconds: number) => {
  console.info(`Fast forwarding time for ${timeInSeconds} seconds`);

  await network.provider.request({
    method: "evm_increaseTime",
    params: [timeInSeconds],
  });
};
