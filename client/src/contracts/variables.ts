import { neutralColor, successColor, errorColor } from "../style/colors";

export const ProposalStates = {
  None: { name: "", color: neutralColor, value: "" },
  Pending: { name: "Pending", color: neutralColor, value: "0" },
  Active: { name: "Active", color: successColor, value: "1" },
  Canceled: { name: "Canceled", color: errorColor, value: "2" },
  Defeated: { name: "Defeated", color: errorColor, value: "3" },
  Succeeded: { name: "Succeeded", color: successColor, value: "4" },
  Queued: { name: "Queued", color: neutralColor, value: "5" },
  Expired: { name: "Expired", color: errorColor, value: "6" },
  Executed: { name: "Executed", color: successColor, value: "7" },
} as const;

export const ProposalSettings = {
  votingDelayBlocks: 1,
  votingPeriodBlocks: 15,
  quorumPercentage: 0,
  executionDelaySeconds: 20,
} as const;

export const ProposalVotes = {
  "0": { name: "against" },
  "1": { name: "for" },
};

export const DescriptionSeparator = "|:|";
