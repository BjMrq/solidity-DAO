/* eslint-disable @typescript-eslint/indent */
import { DescriptionSeparator } from "./variables";

export const buildDescriptionWithFunctionDetails = (
  functionSignature: string,
  callArguments: string[],
  descriptionBody: string
) =>
  `${functionSignature?.replace(
    /\((.*?)\)/,
    `(${callArguments.join(", ")})`
  )}${DescriptionSeparator}${descriptionBody}`;

export const onEventDataDo =
  <TData>(onEventData: (eventData: TData) => void) =>
  (error: Error, eventData: TData) => {
    if (error) console.error(error);
    if (eventData) onEventData(eventData);
  };
