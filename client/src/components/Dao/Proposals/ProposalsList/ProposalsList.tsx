import React, { useCallback, useContext, useEffect } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../../contracts/context";
import { ProposalCreated } from "../../../../contracts/types/GovernanceOrchestrator";
import { onEventDataDo } from "../../../../contracts/utils";
import { gradientBackgroundCss } from "../../../../style/card";
import { ProposalRow } from "./ProposalRow/ProposalRow";

const GradientCardDiv = styled.div`
  ${gradientBackgroundCss}
  box-shadow: 11px 16px 8px rgba(0, 0, 0, 0.4);
  width: 98%;
  padding: 0 40px;
  margin: auto;
`

const CardWrapper = styled.div`
  margin: 30px auto 60px auto;
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


  const updateNewPropositions = useCallback((newProposal: ProposalCreated) => {
    setNewProposalIds([...newProposalIds, newProposal.returnValues.proposalId])
  },[newProposalIds])


  useEffect(() => {

    if(governanceOrchestrator){
      const proposalCreatedListener = governanceOrchestrator.events.ProposalCreated(onEventDataDo(updateNewPropositions))

      return () => {
        proposalCreatedListener.removeAllListeners()
      }
    }

  },[governanceOrchestrator, updateNewPropositions, proposalIds])
  
  return (
    <CardWrapper>
      <GradientCardDiv>
        {
          [...newProposalIds].reverse().map((proposalId, index) => (
            <ProposalRow key={proposalId} proposalId={proposalId} isLast={index + 1 === newProposalIds.length && proposalIds.length === 0}></ProposalRow>
          ))
        }
        {
          [...proposalIds].reverse().map((proposalId, index) => (
            <ProposalRow key={proposalId} proposalId={proposalId} isLast={index + 1 === proposalIds.length}></ProposalRow>
          ))
        }
      </GradientCardDiv>
    </CardWrapper>
  )
}
