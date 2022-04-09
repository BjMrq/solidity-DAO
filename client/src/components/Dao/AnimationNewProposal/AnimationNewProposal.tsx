import React, { Fragment } from 'react'
import { PanelWrapper } from "../../shared/PanelWrapper/PanelWrapper"
import { Web3Guard } from "../../Web3Guard/Web3Guard"
import { NewProposal } from "./NewProposal/NewProposal"
import { SpaceAnimation } from "./SpaceAnimation/SpaceAnimation"

//For design decision 2
// const AnimationDiv = styled.div`
//   min-width: 60%;
//   max-width: 60%;
//   margin: auto;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `

// const NewProposalDiv = styled.div`
//   min-width: 40%;
//   max-width: 40%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `

// const Flexit = styled.div`
//   width: 100%;
//   display: flex;
//   flex-wrap: wrap;
// `

export function AnimationNewProposal() {
  return (
    <PanelWrapper title="Light Color Governance">
      <Fragment>
        <SpaceAnimation/>
        <Web3Guard>
          <NewProposal/>
        </Web3Guard>
      </Fragment>
    </PanelWrapper>
  )
}