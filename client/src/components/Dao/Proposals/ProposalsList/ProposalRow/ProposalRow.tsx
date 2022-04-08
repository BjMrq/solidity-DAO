import React, { Fragment, useContext, useEffect, useState } from 'react';
import styled from "styled-components";
import { Web3Context } from "../../../../../contracts/context";
import { type PossibleProposalState } from "../../../../../contracts/types";
import { DescriptionSeparator, ProposalStates } from "../../../../../contracts/variables";
import { borderRadius } from "../../../../../style/characteristics";
import { backGroundColor, lightColor } from "../../../../../style/colors";
import { waitForTime } from "../../../../../utils/sleep";
import { ProposalAction } from "./PropositionQueue/PropositionQueue";
import { PropositionVote } from "./PropositionVote/PropositionVote";
import { waitUtilsForGovernance } from "./state-wait";
import { ActionWrapper, GradientUnderline, ProposalDescription, ProposalDescriptionLabel, ProposalDescriptionSubLabel } from "./style";
import { getStateFromStateStateValue, onEventDataIfSamePropositionIdDo, propositionHasPassed, propositionIsPending, propositionIsQueued } from "./utils";


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


export function _ProposalRow({proposalId, isLast}: {proposalId: string, isLast?: boolean}) {
  const { contracts: {governanceOrchestrator}, web3Instance, canParticipateToDao} = useContext(Web3Context);

  const [proposalState, setProposalState] = useState<PossibleProposalState>(ProposalStates.None)

  const [proposal, setProposal] = useState<ProposalInfo>({callDescription: "", proposalDescription: "", description: "", targets: [], calldatas: [], values: []})

  const [canExecute, setCanExecute] = useState(false)

  const {waitForBlockNumber, waitForProposalStateToNotBe} = waitUtilsForGovernance(web3Instance, governanceOrchestrator)

  //TODO link to explorer to proposition creation
  

  const waitForBlockNumberAndEnsurePropositionStateIsPassed = async (
    proposalId: string,
    blockNumber: number,
    propositionStateToHavePassed: PossibleProposalState
  ) => {
    await waitForBlockNumber(blockNumber);
  
    const newStateValueAtBlock = (await governanceOrchestrator.methods
      .state(proposalId)
      .call()) as PossibleProposalState["value"];
  
    if (newStateValueAtBlock !== propositionStateToHavePassed.value) {
  
      return setProposalState(getStateFromStateStateValue(newStateValueAtBlock));
    } else {
      const newStateValue = await waitForProposalStateToNotBe(
        proposalId,
        propositionStateToHavePassed
      );

  
      return setProposalState(getStateFromStateStateValue(newStateValue));
    }
  }

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
    }
    )();
  }, [])

  useEffect(() => {
    (async () => {
            
      if(propositionIsPending(proposalState)){

        await waitForBlockNumberAndEnsurePropositionStateIsPassed(
          proposalId,
          Number(await governanceOrchestrator.methods.proposalSnapshot(proposalId).call()),
          ProposalStates.Pending
        )

        return () => ({})
      }

      if(propositionHasPassed(proposalState)){

        const proposalQueueListener = governanceOrchestrator.events
          .ProposalQueued(onEventDataIfSamePropositionIdDo(proposalId, () => setProposalState(ProposalStates.Queued)))
  
        return () => {
          proposalQueueListener.removeAllListeners()
        }
      }


      if(propositionIsQueued(proposalState)){

        const proposalQueueListener = governanceOrchestrator.events
          .ProposalExecuted(onEventDataIfSamePropositionIdDo(proposalId, () => setProposalState(ProposalStates.Executed)))

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

        <PropositionVote 
          proposalId={proposalId}
          proposalState={proposalState}
          waitForBlockNumberAndEnsurePropositionStateIsPassed={waitForBlockNumberAndEnsurePropositionStateIsPassed}
        />
        
        {
          canParticipateToDao && 
          <ActionWrapper>
            <ProposalAction 
              actionName={"queue"}
              proposal={proposal}
              actionExecutionCondition={true}
              actionDisplayCondition={propositionHasPassed(proposalState)}
            />

            <ProposalAction 
              actionName={"execute"}
              proposal={proposal}
              actionDisplayCondition={propositionIsQueued(proposalState)}
              actionExecutionCondition={canExecute}
            />

          </ActionWrapper>
        }
      </ProposalRowWrapper>
      { !Boolean(isLast) && <ProposalSeparator/> }

    </Fragment>
  )
}

export const ProposalRow = _ProposalRow
