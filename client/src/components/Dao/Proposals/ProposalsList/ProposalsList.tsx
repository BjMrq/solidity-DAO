import React, { useCallback, useContext, useEffect } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../../contracts/context";
import { ProposalCreated } from "../../../../contracts/types/GovernanceOrchestrator";
import { onEventDataDo } from "../../../../contracts/utils";
import { gradientBackgroundCss } from "../../../../style/card";
import { borderRadius } from "../../../../style/characteristics";
import { ProposalRow } from "./ProposalRow/ProposalRow";


const GradientCardDiv = styled.div`
${gradientBackgroundCss}
  box-shadow: 11px 16px 8px rgba(0, 0, 0, 0.4);
  max-width: 100%;
  padding: 0 40px;
  margin: auto;

  border-radius: ${borderRadius};

  @media screen and (max-width: 1270px) {  
    width: 100%;
  }
`

const CardWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

export function ProposalsList() {
  const { contracts: {governanceOrchestrator}} = useContext(Web3Context);

  const [proposalIds, setProposalIds] = React.useState<string[]>([]);
  const [newProposalIds, setNewProposalIds] = React.useState<string[]>([]);

  const keepFirstAndLast3Proposals = (proposalsId: string[]) => [...proposalsId.slice(-3).reverse(), ...proposalsId.slice(0, 1)]

  useEffect(() => {
    (async () => {
      if(governanceOrchestrator) setProposalIds((keepFirstAndLast3Proposals(await governanceOrchestrator.methods.getAllProposalsId().call())))
    }
    )();
  }, [governanceOrchestrator])


  const updateNewProposals = useCallback((newProposal: ProposalCreated) => {
    setNewProposalIds([newProposal.returnValues.proposalId, ...newProposalIds])
  },[proposalIds])


  useEffect(() => {

    if(governanceOrchestrator){
      const proposalCreatedListener = governanceOrchestrator.events.ProposalCreated(onEventDataDo(updateNewProposals))

      return () => {
        proposalCreatedListener.removeAllListeners()
      }
    }

  },[governanceOrchestrator, updateNewProposals])

  
  return (
    <CardWrapper>
      <GradientCardDiv >
        {
          [...newProposalIds].reverse().map((proposalId, index) => (

            <ProposalRow key={proposalId} proposalId={proposalId} isLast={index + 1 === newProposalIds.length && proposalIds.length === 0}></ProposalRow>

          ))
        }
        {
          proposalIds.map((proposalId, index) => (

            <ProposalRow key={proposalId} proposalId={proposalId} isLast={index + 1 === proposalIds.length}></ProposalRow>

          ))
        }
      </GradientCardDiv>      
    </CardWrapper>
  )
}
