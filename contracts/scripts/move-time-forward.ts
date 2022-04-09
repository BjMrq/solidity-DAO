import { executeScriptWith } from "./helpers/execute-script"
import { moveChainTimeFor } from "../helpers/chain/move-blocks"

export const moveTimeForwardFor = async (numberOfDays: number) => {
  await moveChainTimeFor(numberOfDays * 24 * 60 * 60)
}

executeScriptWith(moveTimeForwardFor(5))
