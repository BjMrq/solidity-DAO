import React, { Fragment } from 'react'
import { PanelWrapper } from "../../shared/PanelWrapper/PanelWrapper"
import { NewProposal } from "./NewProposal/NewProposal"
import { SpaceAnimation } from "./SpaceAnimation/SpaceAnimation"


export function AnimationNewProposal() {
  return (
    <PanelWrapper title="Light Color Governance">
      <Fragment>
        <SpaceAnimation/>
        <NewProposal/>
      </Fragment>
    </PanelWrapper>
  )
}