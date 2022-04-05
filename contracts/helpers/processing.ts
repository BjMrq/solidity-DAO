/**
 * Used to prevent NONCE_EXPIRED error when transactions are sent too fast
 */
export const asyncSequentialMap = async <TItem, TReturn>(
  arrayToMapOn: TItem[],
  callbackToExecuteOnItem: (item: TItem) => Promise<TReturn>,
  initialValue: TReturn[] = []
) =>
  await arrayToMapOn.reduce(
    async (accumulator, item) => [...(await accumulator), await callbackToExecuteOnItem(item)],
    Promise.resolve(initialValue)
  )
