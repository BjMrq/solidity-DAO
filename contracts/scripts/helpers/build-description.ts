import { Contract } from "ethers"
import { getFunctionSignature } from "../../helpers/contracts/function-signature"

export const buildDescriptionWithFunctionDetails = (
  contract: Contract,
  functionName: string,
  callArguments: any[] | readonly any[],
  descriptionBody: string
) =>
  `${getFunctionSignature(contract.interface.functions, functionName)?.replace(
    /\((.*?)\)/,
    `( ${callArguments.join(", ")} )`
  )}|:|${descriptionBody}`
