import React, { useContext, useEffect, useState } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../../../contracts/context";
import { PossibleProposalState } from "../../../../../contracts/types";
import { DescriptionSeparator, ProposalSettings, ProposalStates } from "../../../../../contracts/variables";
import { gradientBackgroundCss } from "../../../../../style/card";
import { backGroundColor, errorColor, successColor } from "../../../../../style/colors";
import { bordered } from "../../../../../style/input-like";
import { sleep } from "../../../../../utils/sleep";


const ProposalRowWrapper = styled.div`
  font-size: 20px;
  margin: 5px 0;
  padding: 20px;
  background-color: ${backGroundColor};
  text-overflow: ellipsis;
  overflow-wrap: break-word;
`

const GradientUnderline = styled.div`
  ${gradientBackgroundCss}
  width: 30%;
  border-radius: 0;
  height: 4px;
`

// const ProposalBody = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `

const ProposalDescriptionLabel = styled.div`
  text-align: left;
  margin: 20px auto 10px auto;
  width: 100%;
  font-size: 22px;
  font-weight: 800;
`

const ProposalDescriptionSubLabel = styled.div`
  text-align: left;
  margin: 20px auto 0 auto;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
`

const ProposalDescription = styled.div`
  text-align: left;
  width: 100%;
  font-size: 18px;
  margin: 20px 0 35px 0;
`

const ProposalStatus = styled.div<{color: string}>`
  font-size: 10px;
  border-radius: 6px;
  border: 1.3px solid ${({color}) => color};
  color:  ${({color}) => color};
  padding: 3px;
  text-align: center;
  width: 55px;
  margin-left: auto; 
  margin-right: 0;
`

const VoteWrapper = styled.div`
  margin: 40px auto 15px auto;
  height: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`

const VoteOption = styled.div<{color: string}>`
  background-color: ${({color}) => color};
  width: 50%;
  height: 45px;
  margin: 5px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  ${bordered}

  &:hover,
  &:focus {
    box-shadow: 0 0.2em 0.2em -0.1em ${({color}) => color};
    transform: translateY(-0.06em);
  }
`

export function ProposalRow({proposalId}: {proposalId: string}) {
  const { contracts: {governanceOrchestrator}, web3Instance} = useContext(Web3Context);

  const [proposalState, setProposalState] = useState<PossibleProposalState>("-1")
  const [proposal, setProposal] = useState<{callDescription: string,proposalDescription: string, targets: string[], calldatas: string[]}>({callDescription: "", proposalDescription: "", targets: [], calldatas: []})

  const [votes] = useState({
    for:0,
    against: 0
  })

  // const votesAreOpen = () => ProposalState[proposalState].name === "Active"

  const votesAreOpen = (statusName: PossibleProposalState) => ProposalStates[statusName].name === "Active"

  const propositionIsPending = (statusName: PossibleProposalState) => ProposalStates[statusName].name === "Pending"
  
  const hasVoted = (vote: string) => {
    console.log(vote);
  }

  const waitForBlocks = async (blockNumber: number) => {

    let currentBlockNumber = await web3Instance.eth.getBlockNumber()
    const blockNumberToWaitFor = currentBlockNumber + blockNumber

    while (currentBlockNumber < blockNumberToWaitFor){
      currentBlockNumber = await web3Instance.eth.getBlockNumber()
      await sleep(4000)
    }

    return true
   
  }


  useEffect(() => {
    (async () => {
      //@ts-expect-error
      const {targets, calldatas , description} = await governanceOrchestrator.methods.getProposal(proposalId).call()

      const [callDescription, proposalDescription] = description.split(DescriptionSeparator)

      setProposal({targets, calldatas, callDescription, proposalDescription})

      setProposalState(await governanceOrchestrator.methods.state(proposalId).call() as PossibleProposalState)
    }
    )();
  }, [])

  useEffect(() => {
    (async () => {
      
      if(propositionIsPending(proposalState)){
        await waitForBlocks(ProposalSettings.votingDelayBlocks)

        setProposalState(await governanceOrchestrator.methods.state(proposalId).call() as PossibleProposalState)
      }

      if(votesAreOpen(proposalState)){
        // console.log(await governanceOrchestrator.methods.getVotes(proposalId).call());

        governanceOrchestrator.events.VoteCast().on("data", (thing) => {
          console.log(thing);
        })
      }




    }
    )();
  }, [proposalState])

  //TODO link to explorer

  return (
    <ProposalRowWrapper>
      <div style={{minWidth: "100%"}}>
        <ProposalStatus color={ProposalStates[proposalState].color}>
          {ProposalStates[proposalState].name}
        </ProposalStatus>
      </div>
      <ProposalDescriptionLabel>
        Calldata description:
      </ProposalDescriptionLabel>
      <GradientUnderline/>
      <ProposalDescriptionSubLabel>
        Functions:
      </ProposalDescriptionSubLabel>
      <ProposalDescription>
        {proposal.callDescription}
      </ProposalDescription>
      <ProposalDescriptionSubLabel>
        Contracts:
      </ProposalDescriptionSubLabel>
      <ProposalDescription>
        {proposal.targets.join(", ")}
      </ProposalDescription>
      <ProposalDescriptionLabel>
        Proposal Description:
      </ProposalDescriptionLabel>
      <GradientUnderline/>
      <ProposalDescription>
        {proposal.proposalDescription}
      </ProposalDescription>
      {votesAreOpen(proposalState) && 
      <VoteWrapper>
        <VoteOption color={successColor} onClick ={() => hasVoted("for")}>In favor {votes.for}</VoteOption>
        <VoteOption color={errorColor} onClick ={() => hasVoted("against")}>Against {votes.against}</VoteOption>
      </VoteWrapper>
      }
    </ProposalRowWrapper>
  )
}
