export const ifMountedSetDataStateWith = <TData>(
  getDataFunction: () => Promise<TData>,
  setStateFunction: (dataToSetStateWith: TData) => void,
  cleanUpFunction?: () => void
) => {
  let isMounted = true;

  getDataFunction().then((fetchedData) => {
    if (isMounted) setStateFunction(fetchedData);
  });

  return () => {
    isMounted = false;
    if (cleanUpFunction) cleanUpFunction();
  };
};
