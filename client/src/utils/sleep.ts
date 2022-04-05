export const sleep = (millisecondToSleepFor: number) =>
  new Promise((resolve) => setTimeout(resolve, millisecondToSleepFor));
