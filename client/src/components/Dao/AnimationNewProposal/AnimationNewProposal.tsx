import React, { Fragment } from 'react'
import { PanelWrapper } from "../../shared/PanelWrapper/PanelWrapper"
import { Web3Guard } from "../../Web3Guard/Web3Guard"
import { NewProposal } from "./NewProposal/NewProposal"
import { SpaceAnimation } from "./SpaceAnimation/SpaceAnimation"


export function AnimationNewProposal() {
  return (
    <PanelWrapper title="DAO Animation">
      <Fragment>
        <SpaceAnimation/>
        <Web3Guard>
          <NewProposal/>
        </Web3Guard>
      </Fragment>
    </PanelWrapper>
  )
}
