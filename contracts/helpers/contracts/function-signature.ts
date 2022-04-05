export const getFunctionSignature = (
  interfaceFunction: Record<string, any>,
  functionName: string
) =>
  Object.keys(interfaceFunction).find((functionSignature) =>
    functionSignature.includes(functionName)
  );
