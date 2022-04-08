import * as R from "ramda";
import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { Web3Context } from "../../../../../../contracts/context";
import { PossibleProposalState, PossibleProposalVotes } from "../../../../../../contracts/types";
import { VoteCast } from "../../../../../../contracts/types/GovernanceOrchestrator";
import { ProposalStates } from "../../../../../../contracts/variables";
import { errorColor, neutralColor, successColor } from "../../../../../../style/colors";
import { ActionOptionButton, ActionWrapper, GradientUnderline, ProposalDescription, ProposalDescriptionLabel } from "../style";
import { onEventDataIfSamePropositionIdDo, votesAreOpen } from "../utils";


export function PropositionVote({
  proposalId, 
  proposalState, 
  waitForBlockNumberAndEnsurePropositionStateIsPassed}: 
{
  proposalId: string, proposalState: PossibleProposalState, waitForBlockNumberAndEnsurePropositionStateIsPassed: (proposalId: string, blockNumber: number, propositionStateToHavePassed: PossibleProposalState) => Promise<void>
}) {
  const { contracts: {governanceOrchestrator}, web3Instance, currentAccount, toastContractSend, canParticipateToDao} = useContext(Web3Context);

  const [votes, setVotes] = useState({
    hasVoted: false,
    "0": "0",
    "1": "0"
  })

  const submitVote = async(vote: PossibleProposalVotes) => await toastContractSend(governanceOrchestrator.methods.castVote(proposalId, vote))

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

  useEffect(() => {
    (async () => {
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
      if(votesAreOpen(proposalState)){
  
        const voteCastListener = governanceOrchestrator.events.VoteCast(onEventDataIfSamePropositionIdDo(proposalId, onVoteCastEventReceived))
  
        await waitForBlockNumberAndEnsurePropositionStateIsPassed(
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
        In Favor: {votes["1"]}
        <br/>
        Against: {votes["0"]}
      </ProposalDescription> 
    
      {
        canParticipateToDao && 
      <ActionWrapper>
        {
          votesAreOpen(proposalState) && 
        ( votes.hasVoted ? 
          <ActionOptionButton disabled color={neutralColor}>
                Vote submitted
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
      </ActionWrapper>
      }
    </Fragment>
  )
}
