/* eslint-disable @typescript-eslint/indent */
import { PossibleProposalState } from "../../../../../contracts/types";
import { ProposalStates } from "../../../../../contracts/variables";

export const proposalIsPending = (proposalState: PossibleProposalState) =>
  proposalState.name === "Pending";

export const proposalIsQueued = (proposalState: PossibleProposalState) =>
  proposalState.name === "Queued";

export const votesAreOpen = (proposalState: PossibleProposalState) =>
  proposalState.name === "Active";

export const proposalHasPassed = (proposalState: PossibleProposalState) =>
  proposalState.name === "Succeeded";

export const onEventDataIfSameProposalIdDo =
  <TData extends { returnValues: { proposalId: string } }>(
    proposalId: string,
    onEventData: (eventData: TData) => void
  ) =>
  (error: Error, eventData: TData) => {
    if (error) console.error(error);
    if (eventData && eventData.returnValues.proposalId === proposalId)
      onEventData(eventData);
  };

export const getStateFromStateStateValue = (
  proposalStateValue: PossibleProposalState["value"]
) =>
  Object.values(ProposalStates).find(
    ({ value }) => value === proposalStateValue
  ) as PossibleProposalState;
