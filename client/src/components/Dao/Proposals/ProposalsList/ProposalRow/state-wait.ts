import Web3 from "web3";
import { GovernanceOrchestrator } from "../../../../../contracts/types/GovernanceOrchestrator";
import { PossibleProposalState } from "../../../../../contracts/types";
import { sleep } from "../../../../../utils/sleep";

export const waitUtilsForGovernance = (
  web3Instance: Web3,
  governanceOrchestrator: GovernanceOrchestrator
) => ({
  waitForBlockNumber: async (blockNumber: number) => {
    let currentBlockNumber = await web3Instance.eth.getBlockNumber();

    while (currentBlockNumber < blockNumber) {
      await sleep(4000);
      currentBlockNumber = await web3Instance.eth.getBlockNumber();
    }

    return currentBlockNumber;
  },
  waitForProposalStateToNotBe: async (
    proposalId: string,
    proposalStateToPass: PossibleProposalState
  ) => {
    let currentProposalState = (await governanceOrchestrator.methods
      .state(proposalId)
      .call()) as PossibleProposalState["value"];

    while (currentProposalState === proposalStateToPass.value) {
      await sleep(4000);
      currentProposalState = (await governanceOrchestrator.methods
        .state(proposalId)
        .call()) as PossibleProposalState["value"];
    }

    return currentProposalState;
  },
});
