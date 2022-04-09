/* eslint-disable @typescript-eslint/no-unused-vars */
import * as R from "ramda";
import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { Web3Context } from "../../../../../../contracts/context";
import { PossibleProposalState, PossibleProposalVotes } from "../../../../../../contracts/types";
import { VoteCast } from "../../../../../../contracts/types/GovernanceOrchestrator";
import { ProposalStates } from "../../../../../../contracts/variables";
import { actionColor, errorColor, neutralColor, successColor } from "../../../../../../style/colors";
import { ifMountedSetDataStateWith } from "../../../../../../utils/state-update";
import { toToken } from "../../../../../../utils/token";
import { ActionOptionButton, ActionWrapper, GradientUnderline, ProposalDescription, ProposalDescriptionLabel } from "../style";
import { onEventDataIfSameProposalIdDo, proposalIsPending, votesAreOpen } from "../utils";


export function ProposalVote({
  proposalId, 
  proposalState, 
  waitForBlockNumberAndEnsureProposalStateIsPassed}: 
{
  proposalId: string, proposalState: PossibleProposalState, waitForBlockNumberAndEnsureProposalStateIsPassed: (proposalId: string, blockNumber: number, proposalStateToHavePassed: PossibleProposalState) => Promise<void>
}) {
  const { contracts: {governanceOrchestrator, astroToken}, web3Instance, currentAccount, toastContractSend, canParticipateToDao} = useContext(Web3Context);
  const [justUpdatedVotingPower, setJustUpdatingVotingPower] = useState(false)

  const [votes, setVotes] = useState({
    hasVoted: false,
    "0": "0",
    "1": "0"
  })

  const registerNewVotingPower = async() => {
    await toastContractSend(astroToken.methods.delegate(currentAccount), {}, "Self delegation")
    setJustUpdatingVotingPower(true)
  }

  const submitVote = async(vote: PossibleProposalVotes) => await toastContractSend(governanceOrchestrator.methods.castVote(proposalId, vote), {}, "Vote for proposal")

  const onVoteCastEventReceived = useCallback((castedVote: VoteCast) => {
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
  }, [votes])

  const getVoteState = async () => {
    const {againstVotes, forVotes} = await governanceOrchestrator.methods.proposalVotes(proposalId).call()

    const hasVoted = await governanceOrchestrator.methods.hasVoted(proposalId, currentAccount).call()

    return {
      "0": againstVotes, 
      "1": forVotes,
      hasVoted
    }
  }

  //token more snapshot create


  useEffect(() => {
    return ifMountedSetDataStateWith(getVoteState, setVotes)
  }, [])

  useEffect(() => {
    (async () => {
      if(votesAreOpen(proposalState)){
  
        const voteCastListener = governanceOrchestrator.events.VoteCast(onEventDataIfSameProposalIdDo(proposalId, onVoteCastEventReceived))
  
        await waitForBlockNumberAndEnsureProposalStateIsPassed(
          proposalId,
          Number(await governanceOrchestrator.methods.proposalDeadline(proposalId).call()),
          ProposalStates.Active
        )
  
        return () => {
          voteCastListener.removeAllListeners()
        }
        
      }
    }
    )();
  }, [proposalState])


  return (
    <Fragment>

      <ProposalDescriptionLabel>
        Votes:
      </ProposalDescriptionLabel>
      <GradientUnderline/>
    
      <ProposalDescription>
        In Favor: {toToken(votes["1"])}
        <br/>
        Against: {toToken(votes["0"])}
      </ProposalDescription> 
    
      {
        canParticipateToDao && 
      <ActionWrapper>
        {
          votesAreOpen(proposalState) && 
        ( votes.hasVoted ? 
          <ActionOptionButton disabled color={neutralColor}>
                Vote Submitted
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
          proposalIsPending(proposalState) && (
            justUpdatedVotingPower ? 
              <ActionOptionButton disabled color={neutralColor}>
                Vote Opening Soon
              </ActionOptionButton>
              :
              <ActionOptionButton onClick ={registerNewVotingPower} color={actionColor}>
                Update Voting Power
              </ActionOptionButton> 
          )
        }
      </ActionWrapper>
      }
    </Fragment>
  )
}
