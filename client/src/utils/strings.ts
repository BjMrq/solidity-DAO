// Will capitalize every part of the word
export const capitalizeAll = (word: string): string =>
  word
    .split(" ")
    .map((wordPart) => wordPart.charAt(0).toUpperCase() + wordPart.slice(1))
    .join(" ");

export const capitalize = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1);

export const stringFromHexadecimalNumber = (hexadecimalNumber: string) =>
  String(Number(hexadecimalNumber));

export const zeroString = "0";
