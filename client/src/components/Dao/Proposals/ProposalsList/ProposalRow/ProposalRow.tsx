import React, { Fragment, useContext, useEffect, useState } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../../../contracts/context";
import { type PossibleProposalState } from "../../../../../contracts/types";
import { DescriptionSeparator, ProposalStates } from "../../../../../contracts/variables";
import { borderRadius } from "../../../../../style/characteristics";
import { backGroundColor, lightColor } from "../../../../../style/colors";
import { waitForTime } from "../../../../../utils/sleep";
import { ifMountedSetDataStateWith } from "../../../../../utils/state-update";
import { ProposalAction } from "./ProposalAction/ProposalAction";
import { ProposalVote } from "./ProposalVote/ProposalVote";
import { waitUtilsForGovernance } from "./state-wait";
import { ActionWrapper, GradientUnderline, ProposalDescription, ProposalDescriptionLabel, ProposalDescriptionSubLabel } from "./style";
import { getStateFromStateStateValue, onEventDataIfSameProposalIdDo, proposalHasPassed, proposalIsPending, proposalIsQueued } from "./utils";

const ProposalRowWrapper = styled.div`
  font-size: 20px;
  padding: 40px 0;
  background-color: transparent;
  text-overflow: ellipsis;
  overflow-wrap: break-word;
  width: 100%;
`

const ProposalSeparator = styled.div`
  width: 100%;
  height: 20px;
  background-color: ${backGroundColor};
  border-radius: ${borderRadius};
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
  vertical-align: middle;
  margin-bottom: 30px; 
  font-weight: bold;
`

export type ProposalInfo = {callDescription: string, proposalDescription: string, description: string, targets: string[], calldatas: string[], values: string[]}


export function ProposalRow({proposalId, isLast}: {proposalId: string, isLast?: boolean}) {
  const { contracts: {governanceOrchestrator}, web3Instance, canParticipateToDao} = useContext(Web3Context);

  const [proposalState, setProposalState] = useState<PossibleProposalState>(ProposalStates.None)

  const [proposal, setProposal] = useState<ProposalInfo>({callDescription: "", proposalDescription: "", description: "", targets: [], calldatas: [], values: []})

  const [canExecute, setCanExecute] = useState(false)

  const {waitForBlockNumber, waitForProposalStateToNotBe} = waitUtilsForGovernance(web3Instance, governanceOrchestrator)

  //TODO link to explorer to proposal creation
  

  const waitForBlockNumberAndEnsureProposalStateIsPassed = async (
    proposalId: string,
    blockNumber: number,
    proposalStateToHavePassed: PossibleProposalState
  ) => {
    await waitForBlockNumber(blockNumber);
  
    const newStateValueAtBlock = (await governanceOrchestrator.methods
      .state(proposalId)
      .call()) as PossibleProposalState["value"];
  
    if (newStateValueAtBlock !== proposalStateToHavePassed.value) {
  
      return setProposalState(getStateFromStateStateValue(newStateValueAtBlock));
    } else {
      const newStateValue = await waitForProposalStateToNotBe(
        proposalId,
        proposalStateToHavePassed
      );

  
      return setProposalState(getStateFromStateStateValue(newStateValue));
    }
  }

  const getProposalDescriptionState = async () => {
    //@ts-expect-error
    const {targets, calldatas , description, 1: values} = await governanceOrchestrator.methods.getProposal(proposalId).call()

    const [callDescription, proposalDescription] = description.split(DescriptionSeparator)

    return {targets, calldatas, description, callDescription, proposalDescription, values}
  }

  const getProposalState = async () => getStateFromStateStateValue(await governanceOrchestrator.methods.state(proposalId).call() as PossibleProposalState["value"])

  useEffect(() => {
    return ifMountedSetDataStateWith(getProposalDescriptionState, setProposal)
  }, [])

  useEffect(() => {
    return ifMountedSetDataStateWith(getProposalState, setProposalState)
  }, [])

  useEffect(() => {
    (async () => {
            
      if(proposalIsPending(proposalState)){

        await waitForBlockNumberAndEnsureProposalStateIsPassed(
          proposalId,
          Number(await governanceOrchestrator.methods.proposalSnapshot(proposalId).call()),
          ProposalStates.Pending
        )

        return () => ({})
      }

      if(proposalHasPassed(proposalState)){

        const proposalQueueListener = governanceOrchestrator.events
          .ProposalQueued(onEventDataIfSameProposalIdDo(proposalId, () => setProposalState(ProposalStates.Queued)))
  
        return () => {
          proposalQueueListener.removeAllListeners()
        }
      }


      if(proposalIsQueued(proposalState)){

        const proposalQueueListener = governanceOrchestrator.events
          .ProposalExecuted(onEventDataIfSameProposalIdDo(proposalId, () => setProposalState(ProposalStates.Executed)))

        const executionEta = await governanceOrchestrator.methods.proposalEta(proposalId).call()

        await waitForTime(Number(executionEta))

        setCanExecute(true)

        return () => {
          proposalQueueListener.removeAllListeners()
        }
      }

    }
    )();
  }, [proposalState])


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
        <ProposalDescription style={{overflowWrap: "anywhere"}}>
          {proposal.callDescription}
        </ProposalDescription>
        <ProposalDescriptionSubLabel>
        Contracts:
        </ProposalDescriptionSubLabel>
        <ProposalDescription style={{overflowWrap: "anywhere"}}>
          {proposal.targets.join(", ")}
        </ProposalDescription>
        <ProposalDescriptionLabel>
        Proposal Description:
        </ProposalDescriptionLabel>
        <GradientUnderline/>
        <ProposalDescription>
          {proposal.proposalDescription}
        </ProposalDescription>

        <ProposalVote 
          proposalId={proposalId}
          proposalState={proposalState}
          waitForBlockNumberAndEnsureProposalStateIsPassed={waitForBlockNumberAndEnsureProposalStateIsPassed}
        />
        
        {
          canParticipateToDao && 
          <ActionWrapper>
            <ProposalAction 
              actionName={"queue"}
              proposal={proposal}
              actionExecutionCondition={true}
              actionDisplayCondition={proposalHasPassed(proposalState)}
            />

            <ProposalAction 
              actionName={"execute"}
              proposal={proposal}
              awaitActionDisplayText={"Execution Grace Period"}
              actionDisplayCondition={proposalIsQueued(proposalState)}
              actionExecutionCondition={canExecute}
            />

          </ActionWrapper>
        }
      </ProposalRowWrapper>
      { !Boolean(isLast) && <ProposalSeparator/> }
    </Fragment>
  )
}

