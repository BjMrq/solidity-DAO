export const executeScriptWith = (executedFunction: Promise<void>) =>
  executedFunction
    .then(() => process.exit(0))
    .catch((error) => console.error(error));
