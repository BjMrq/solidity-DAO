export const sleep = (millisecondToSleepFor: number) =>
  new Promise((resolve) => setTimeout(resolve, millisecondToSleepFor));

export const waitForTime = async (executionEta: number) => {
  let currentTime = Math.round(new Date().getTime() / 1000);

  while (currentTime < executionEta) {
    await sleep(4000);
    currentTime = Math.round(new Date().getTime() / 1000);
  }

  return true;
};
