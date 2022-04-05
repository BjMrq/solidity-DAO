import { neutralColor, successColor, errorColor } from "../style/colors";

export const ProposalStates = {
  "-1": { name: "", color: neutralColor },
  "0": { name: "Pending", color: neutralColor },
  "1": { name: "Active", color: successColor },
  "2": { name: "Canceled", color: errorColor },
  "3": { name: "Defeated", color: errorColor },
  "4": { name: "Succeeded", color: successColor },
  "5": { name: "Queued", color: neutralColor },
  "6": { name: "Expired", color: errorColor },
  "7": { name: "Executed", color: successColor },
} as const;

export const ProposalSettings = {
  votingDelayBlocks: 1,
  votingPeriodBlocks: 15,
  quorumPercentage: 0,
  executionDelaySeconds: 20,
} as const;

export const DescriptionSeparator = "|:|";
