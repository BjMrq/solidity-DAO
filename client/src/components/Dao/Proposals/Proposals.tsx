import React from 'react';
import { PanelWrapper } from "../../shared/PanelWrapper/PanelWrapper";
import { Web3Guard } from "../../shared/Web3Guards/Web3Guard/Web3Guard";
import { ProposalsList } from "./ProposalsList/ProposalsList";


export function Proposals() {
 

  return (
    <PanelWrapper title={"Proposals Logs"}>
      <Web3Guard displayButton>
        <ProposalsList/>
      </Web3Guard>
    </PanelWrapper>

  );
}