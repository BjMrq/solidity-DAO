import React, { Fragment, useContext } from 'react';
import { Web3Context } from "../../../../../../contracts/context";
import { actionColor, neutralColor } from "../../../../../../style/colors";
import { capitalize } from "../../../../../../utils";
import { ProposalInfo } from "../ProposalRow";
import { ActionOptionButton } from "../style";


export function ProposalAction({
  actionName,
  proposal,
  actionDisplayCondition,
  actionExecutionCondition
}: 
{
  actionName: "queue" | "execute",
  proposal: ProposalInfo ,
  actionDisplayCondition: boolean,
  actionExecutionCondition?: boolean
}) {

  const { contracts: {governanceOrchestrator}, toastContractSend, web3Instance} = useContext(Web3Context);

  const propositionAction = async () => await toastContractSend(governanceOrchestrator.methods[actionName](proposal.targets, proposal.values, proposal.calldatas, web3Instance.utils.keccak256(proposal.description) ))
  

  return (
    
    <Fragment>

      {
        actionDisplayCondition && (
          Boolean(actionExecutionCondition) ? 
            <ActionOptionButton onClick ={propositionAction} color={actionColor}>
              {capitalize(actionName)} Proposition
            </ActionOptionButton> 
            :
            <ActionOptionButton disabled color={neutralColor}>
              {capitalize(actionName)} Proposition
            </ActionOptionButton>
        )
      
      }

    </Fragment>


  )
}
