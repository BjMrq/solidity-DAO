export const isBrowser = (): boolean => typeof window !== "undefined";

export const isLocation = (location: string): boolean =>
  isBrowser() && window.location.pathname.includes(location);

export const ifRunInBrowser = <M>(callback: () => M): false | M =>
  isBrowser() && callback();

export const accessInBrowser = <M>(access: M): false | M =>
  isBrowser() && access;

export const accessObjectInBrowser = <M>(
  objectToAccess: Record<string, M>,
  key: string
): false | M => isBrowser() && objectToAccess[key];
