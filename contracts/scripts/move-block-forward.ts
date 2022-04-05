import { executeScriptWith } from "./helpers/execute-script"
import { moveChainBlocksFor } from "../helpers/chain/move-blocks"

export const moveBlockForwardFor = async (numberOfBlock: number) => {
  await moveChainBlocksFor(numberOfBlock)
}

executeScriptWith(moveBlockForwardFor(2))
