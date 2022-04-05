export const isObjectEmpty = (object: Record<string, unknown>): boolean =>
  Object.keys(object).length === 0;

export const hasMoreThanOne = (choices: any[]) => choices.length > 1;
