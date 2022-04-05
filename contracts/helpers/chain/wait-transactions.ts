import { ContractTransaction } from "ethers";

export const withAwaitConfirmation = (
  transactionFunctionDone: Promise<ContractTransaction> | ContractTransaction
) =>
  Promise.resolve(transactionFunctionDone).then((transaction) =>
    transaction.wait(1)
  );
