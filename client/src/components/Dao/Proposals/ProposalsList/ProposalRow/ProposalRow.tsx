import * as R from "ramda";
import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../../../contracts/context";
import { type PossibleProposalState, type PossibleProposalVotes } from "../../../../../contracts/types";
import { VoteCast } from "../../../../../contracts/types/GovernanceOrchestrator";
import { onEventDataDo } from "../../../../../contracts/utils";
import { DescriptionSeparator, ProposalStates } from "../../../../../contracts/variables";
import { borderRadius } from "../../../../../style/characteristics";
import { actionColor, backGroundColor, errorColor, lightColor, neutralColor, successColor } from "../../../../../style/colors";
import { sleep } from "../../../../../utils/sleep";


const ProposalRowWrapper = styled.div`
  font-size: 20px;
  padding: 40px 0;
  background-color: transparent;
  text-overflow: ellipsis;
  overflow-wrap: break-word;
`

const ProposalSeparator = styled.div`
  width: 100%;
  height: 20px;
  background-color: ${backGroundColor};
  border-radius: ${borderRadius};
`

const GradientUnderline = styled.div`
  background-color: ${lightColor};
  width: 30%;
  border-radius: 0;
  height: 4px;
`

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
  margin: 20px 0 40px 0;
`

const ProposalStatus = styled.div<{color: string}>`
  font-size: 10px;
  border-radius: 6px;
  border: 1.5px solid ${({color}) => color};
  color: ${lightColor};
  background-color: ${({color}) => color};
  padding: 6px;
  text-align: center;
  width: 65px;
  margin-left: auto; 
  margin-right: 0;
  font-weight: bold;
`

const ActionWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`

const ActionOptionButton = styled.div<{blocked?: boolean, color: string}>`
  height: 45px;
  padding: 5px;
  font-weight: bold;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: ${borderRadius};
  width: 100%;

  border: ${({blocked, color}) => Boolean(blocked) ? "none" : `1px solid ${color}`};
  cursor: ${({blocked}) => Boolean(blocked) ? "default" : "pointer"};
  background-color: ${({blocked, color}) => Boolean(blocked) ? neutralColor : color };

  &:hover,
  &:focus {
    filter: ${({blocked}) => Boolean(blocked) ? "none" : "brightness(95%)"};
  }
  &:active {
    filter: ${({blocked}) => Boolean(blocked) ? "none" : "brightness(95%)"};
  }
`


export function ProposalRow({proposalId, isLast}: {proposalId: string, isLast?: boolean}) {
  const { contracts: {governanceOrchestrator}, web3Instance, currentAccount, toastContractSend} = useContext(Web3Context);

  const [proposalState, setProposalState] = useState<PossibleProposalState>(ProposalStates.None)

  const [proposal, setProposal] = useState<{callDescription: string, proposalDescription: string, description: string, targets: string[], calldatas: string[], values: string[]}>({callDescription: "", proposalDescription: "", description: "", targets: [], calldatas: [], values: []})

  const [canExecute, setCanExecute] = useState(false)

  //TODO Module out 1.votes 2.vote button 3.queue button 4.execute button
  const [votes, setVotes] = useState({
    hasVoted: false,
    "0": "0",
    "1": "0"
  })


  const votesAreOpen = (proposalState: PossibleProposalState) => proposalState.name === "Active"

  const propositionIsPending = (proposalState: PossibleProposalState) => proposalState.name === "Pending"

  const propositionIsSucceeded = (proposalState: PossibleProposalState) => proposalState.name === "Succeeded"

  const propositionIsQueued = (proposalState: PossibleProposalState) => proposalState.name === "Queued"
  
  const submitVote = async(vote: PossibleProposalVotes) => await toastContractSend(governanceOrchestrator.methods.castVote(proposalId, vote))

  const queueProposition = async () => await toastContractSend(governanceOrchestrator.methods.queue(proposal.targets, proposal.values, proposal.calldatas, web3Instance.utils.keccak256(proposal.description) ))

  const executeProposition = async () => await toastContractSend(governanceOrchestrator.methods.execute(proposal.targets, proposal.values, proposal.calldatas, web3Instance.utils.keccak256(proposal.description) ))

  const getStateFromStateStateValue = (propositionStateValue: PossibleProposalState["value"]) => Object.values(ProposalStates).find(({value}) =>value === propositionStateValue) as PossibleProposalState


  const waitForEta = async (executionEta: number) => {

    let currentTime = Math.round((new Date()).getTime() / 1000)

    while (currentTime < executionEta){
      await sleep(4000)
      currentTime = Math.round((new Date()).getTime() / 1000)
    }

    return true
  }

  const waitForBlockNumber = async (blockNumber: number) => {

    let currentBlockNumber = await web3Instance.eth.getBlockNumber()

    while (currentBlockNumber < blockNumber){
      await sleep(4000)
      currentBlockNumber = await web3Instance.eth.getBlockNumber()
    }

    return currentBlockNumber
  }

  const waitForProposalStateToNotBe = async (proposalStateToPass: PossibleProposalState) => {

    let currentPropositionState = (await governanceOrchestrator.methods.state(proposalId).call()) as PossibleProposalState["value"]

    while (currentPropositionState === proposalStateToPass.value){
      await sleep(4000)
      currentPropositionState = (await governanceOrchestrator.methods.state(proposalId).call()) as PossibleProposalState["value"]
    }

    return currentPropositionState
  }

  const waitForBlockNumberAndEnsurePropositionStateIsPassed = async (blockNumber: number, propositionStateToHavePassed: PossibleProposalState) => {
    await waitForBlockNumber(blockNumber)

    const newStateValueAtBlock = (await governanceOrchestrator.methods.state(proposalId).call()) as PossibleProposalState["value"]

    if(newStateValueAtBlock !== propositionStateToHavePassed.value) {
      setProposalState(
        getStateFromStateStateValue(newStateValueAtBlock)
      )

      return newStateValueAtBlock
    } else {

      const newStateValue = await waitForProposalStateToNotBe(propositionStateToHavePassed)

      setProposalState(
        getStateFromStateStateValue(newStateValue)
      )

      return newStateValue

    }
  }

  const onVoteCastEventReceived = useCallback((castedVote: VoteCast) => {
    if(castedVote.returnValues.proposalId === proposalId){
      const voteValue = castedVote.returnValues.support as PossibleProposalVotes

      const newVotesCount = R.assoc( 
        voteValue,
        web3Instance.utils.toBN( castedVote.returnValues.weight).add(web3Instance.utils.toBN(votes[voteValue])).toString(),
        votes
      )

      setVotes(R.assoc( 
        "hasVoted",
        castedVote.returnValues.voter === currentAccount,
        newVotesCount
      ))
    }
  }, [votes])


  useEffect(() => {

    (async () => {
      //@ts-expect-error
      const {targets, calldatas , description, 1: values} = await governanceOrchestrator.methods.getProposal(proposalId).call()

      const [callDescription, proposalDescription] = description.split(DescriptionSeparator)

      setProposal({targets, calldatas, description, callDescription, proposalDescription, values})

      setProposalState(
        getStateFromStateStateValue(
          await governanceOrchestrator.methods.state(proposalId).call() as PossibleProposalState["value"]
        ) 
      )

      const {againstVotes, forVotes} = await governanceOrchestrator.methods.proposalVotes(proposalId).call()

      setVotes({
        "0": againstVotes, 
        "1": forVotes,
        hasVoted: await governanceOrchestrator.methods.hasVoted(proposalId, currentAccount).call()
      })
    }
    )();
  }, [])

  useEffect(() => {
    (async () => {
      
      if(propositionIsPending(proposalState)){

        await waitForBlockNumberAndEnsurePropositionStateIsPassed(
          Number(await governanceOrchestrator.methods.proposalSnapshot(proposalId).call()),
          ProposalStates.Pending
        )

        return () => ({})
      }
      
      if(votesAreOpen(proposalState)){

        const voteCastListener = governanceOrchestrator.events.VoteCast(onEventDataDo(onVoteCastEventReceived))

        await waitForBlockNumberAndEnsurePropositionStateIsPassed(
          Number(await governanceOrchestrator.methods.proposalDeadline(proposalId).call()),
          ProposalStates.Active
        )

        return () => {
          voteCastListener.removeAllListeners()
        }
      }


      if(propositionIsSucceeded(proposalState)){

        const proposalQueueListener = governanceOrchestrator.events.ProposalQueued(onEventDataDo((queueEventData) => {
          if(queueEventData.returnValues.proposalId === proposalId) setProposalState(ProposalStates.Queued)
        }))

        return () => {
          proposalQueueListener.removeAllListeners()
        }
      }

      if(propositionIsQueued(proposalState)){

        const proposalQueueListener = governanceOrchestrator.events.ProposalExecuted(onEventDataDo((queueEventData) => {
          if(queueEventData.returnValues.proposalId === proposalId) setProposalState(ProposalStates.Executed)
        }))

        const executionEta = await governanceOrchestrator.methods.proposalEta(proposalId).call()

        await waitForEta(Number(executionEta))

        setCanExecute(true)

        return () => {
          proposalQueueListener.removeAllListeners()
        }
      }

    }
    )();
  }, [proposalState])

  //TODO link to explorer

  return (

    <Fragment>
      <ProposalRowWrapper>
        <div style={{minWidth: "100%"}}>
          <ProposalStatus color={proposalState.color}>
            {proposalState.name}
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
        <ProposalDescriptionLabel>
        Votes:
        </ProposalDescriptionLabel>
        <GradientUnderline/>
        <ProposalDescription>
        In Favor: {votes["1"]}
          <br/>
        Against: {votes["0"]}
        </ProposalDescription>
        
        <ActionWrapper>

          {
            votesAreOpen(proposalState) && 
     ( votes.hasVoted ? 
       <ActionOptionButton blocked color={neutralColor}>
            Voted submitted
       </ActionOptionButton>
       : 
       <Fragment>
         <ActionOptionButton color={successColor} onClick ={() => submitVote("1")}>
           In Favor
         </ActionOptionButton>
         <div style={{width: "40px"}}/>
         <ActionOptionButton color={errorColor} onClick ={() => submitVote("0")}>
           Against
         </ActionOptionButton>
       </Fragment>
     )
          }


          { 
            propositionIsSucceeded(proposalState) && 
          <ActionOptionButton onClick ={queueProposition} color={actionColor}>
          Queue Proposition
          </ActionOptionButton>
          }

          { 
            propositionIsQueued(proposalState) && (
              canExecute ? 
                <ActionOptionButton onClick={executeProposition} color={actionColor}>
          Execute Proposition
                </ActionOptionButton>
                :
                <ActionOptionButton blocked color={neutralColor}>
          Execute Proposition
                </ActionOptionButton>
            )

          }

        </ActionWrapper>
      </ProposalRowWrapper>
      { !Boolean(isLast) && <ProposalSeparator/> }

    </Fragment>
  )
}
