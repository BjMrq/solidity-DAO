import React, { useContext, useEffect } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../../contracts/context";
import { onEventDataDo } from "../../../../contracts/utils";
import { gradientBackgroundCss } from "../../../../style/card";
import { ProposalRow } from "./ProposalRow/ProposalRow";

const GradientCardDiv = styled.div`
  ${gradientBackgroundCss}
  width: 98%;
  padding: 0 5px;
  margin: auto;
`

const CardWrapper = styled.div`
  margin: 60px auto 60px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

export function ProposalsList() {
  const { contracts: {governanceOrchestrator}} = useContext(Web3Context);

  const [proposalIds, setProposalIds] = React.useState<string[]>([]);
  const [newProposalIds, setNewProposalIds] = React.useState<string[]>([]);

  useEffect(() => {
    (async () => {
      governanceOrchestrator && setProposalIds(await governanceOrchestrator.methods.getAllProposalsId().call())
    }
    )();
  }, [governanceOrchestrator])


  useEffect(() => {

    if(governanceOrchestrator){

      governanceOrchestrator.events.ProposalCreated(onEventDataDo((newProposal) => setNewProposalIds([...newProposalIds, newProposal.returnValues.proposalId])))
      
      //TODO SAME PATTERN THAN UP
      governanceOrchestrator.events.ProposalQueued().on('data', console.log).on('error', console.error)
  
      governanceOrchestrator.events.ProposalExecuted().on('data', console.log).on('error', console.error)
    }

  },[governanceOrchestrator, proposalIds])
  
  return (
    <CardWrapper>
      <GradientCardDiv>
        {
          [...newProposalIds].reverse().map((proposalId) => (
            <ProposalRow key={proposalId} proposalId={proposalId} ></ProposalRow>
          ))
        }
        {
          [...proposalIds].reverse().map((proposalId) => (
            <ProposalRow key={proposalId} proposalId={proposalId} ></ProposalRow>
          ))
        }
      </GradientCardDiv>
    </CardWrapper>
  )
}
