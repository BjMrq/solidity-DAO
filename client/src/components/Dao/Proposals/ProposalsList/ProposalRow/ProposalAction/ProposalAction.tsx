import React, { Fragment, useContext } from 'react';
import { Web3Context } from "../../../../../../contracts/context";
import { actionColor, neutralColor } from "../../../../../../style/colors";
import { capitalize } from "../../../../../../utils";
import { ProposalInfo } from "../ProposalRow";
import { ActionOptionButton } from "../style";


export function ProposalAction({
  actionName,
  awaitActionDisplayText,
  proposal,
  actionDisplayCondition,
  actionExecutionCondition
}: 
{
  actionName: "queue" | "execute",
  proposal: ProposalInfo ,
  actionDisplayCondition: boolean,
  awaitActionDisplayText?: string,
  actionExecutionCondition?: boolean
}) {

  const { contracts: {governanceOrchestrator}, toastContractSend, web3Instance} = useContext(Web3Context);

  const proposalAction = async () => await toastContractSend(
    governanceOrchestrator.methods[actionName](proposal.targets, proposal.values, proposal.calldatas, web3Instance.utils.keccak256(proposal.description) ),  
    {}, 
    `${capitalize(actionName)} proposal`
  )
  

  return (
    
    <Fragment>

      {
        actionDisplayCondition && (
          Boolean(actionExecutionCondition) ? 
            <ActionOptionButton onClick ={proposalAction} color={actionColor}>
              {capitalize(actionName)} Proposal
            </ActionOptionButton> 
            :
            <ActionOptionButton disabled color={neutralColor}>
              {awaitActionDisplayText}
            </ActionOptionButton>
        )
      
      }

    </Fragment>


  )
}
