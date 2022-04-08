import React, { useCallback, useContext, useEffect } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../../contracts/context";
import { ProposalCreated } from "../../../../contracts/types/GovernanceOrchestrator";
import { onEventDataDo } from "../../../../contracts/utils";
import { gradientBackgroundCss } from "../../../../style/card";
import { ProposalRow } from "./ProposalRow/ProposalRow";

// import {Animated} from "react-animated-css";


// const ListWrapper = styled.div`
//   max-width: 98%;
//   padding: 2px 20px 0 20px;
//   background-color: #252931;
//   border-radius: ${borderRadius};
//   /* border: 1px solid ${secondColor}; */
//   margin: auto;
//   /* box-shadow: 1px 1px 3px rgba(0,0,0,0.5),
//             inset 8px 8px 10px rgba(0,0,0,0.5); */

//             box-shadow: 1px 1px 3px rgba(0,0,0,0.5), inset 8px 8px 10px rgba(0,0,0,0.5);
//   /* box-shadow: 0 0 0 10px #3b424f; */

//   /* background-color: #3b424f; */

//   max-height: 110vh;
  
//   overflow: scroll;
//   -ms-overflow-style: none;
//   scrollbar-width: none; 
//   &::-webkit-scrollbar {
//     display: none;
//   }
// `

const GradientCardDiv = styled.div`
${gradientBackgroundCss}
  box-shadow: 11px 16px 8px rgba(0, 0, 0, 0.4);
  width: 98%;
  padding: 0 40px;
  margin: auto;

  @media screen and (max-width: 1200px) {  
    width: 100%;
  }
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
  // const [newProposalIds, setNewProposalIds] = React.useState<string[]>([]);

  useEffect(() => {
    (async () => {
      governanceOrchestrator && setProposalIds([...(await governanceOrchestrator.methods.getAllProposalsId().call())].reverse())
    }
    )();
  }, [governanceOrchestrator])


  const updateNewPropositions = useCallback((newProposal: ProposalCreated) => {
    setProposalIds([newProposal.returnValues.proposalId, ...proposalIds])
  },[proposalIds])


  useEffect(() => {

    if(governanceOrchestrator){
      const proposalCreatedListener = governanceOrchestrator.events.ProposalCreated(onEventDataDo(updateNewPropositions))

      return () => {
        proposalCreatedListener.removeAllListeners()
      }
    }

  },[governanceOrchestrator, updateNewPropositions])

  // const renderItem = (index: any, ignore: any) => {
  //   return  <ProposalRow key={proposalIds[index]} proposalId={proposalIds[index]} isLast={index + 1 === proposalIds.length}></ProposalRow>
  // }
  
  return (
    <CardWrapper>
      {/* <ListWrapper> */}
      <GradientCardDiv >
        {/* <ReactList
            itemRenderer={renderItem as any}
            length={proposalIds.length}
            type='variable'
          /> */}
        {
          proposalIds.map((proposalId, index) => (
            <ProposalRow key={proposalId} proposalId={proposalId} isLast={index + 1 === proposalIds.length}></ProposalRow>
          ))
        }
      </GradientCardDiv>
      {/* </ListWrapper> */}



      {/* {
          [...newProposalIds].reverse().map((proposalId, index) => (
            <ProposalRow key={proposalId} proposalId={proposalId} isLast={index + 1 === newProposalIds.length && proposalIds.length === 0}></ProposalRow>
          ))
        }
        {
          [...proposalIds].reverse().map((proposalId, index) => (
            <ProposalRow key={proposalId} proposalId={proposalId} isLast={index + 1 === proposalIds.length}></ProposalRow>
          ))
        } */}
      
    </CardWrapper>
  )
}
