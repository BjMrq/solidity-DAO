export const getFullDate = (): string => {
  const now = new Date();

  // eslint-disable-next-line max-len
  return `${now.getDate()}/${now.getMonth()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
};
