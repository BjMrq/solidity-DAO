import React, { Fragment } from 'react';
import ReactTooltip from 'react-tooltip';
import styled from "styled-components";
import { PanelWrapper } from "../../shared/PanelWrapper/PanelWrapper";
import { Web3Guard } from "../../Web3Guard/Web3Guard";
import { ProposalsList } from "./ProposalsList/ProposalsList";

const TooltipSpan = styled.span`
  font-size: 30px;
  margin-left: 10px;
  `
const TooltipContent = styled.div`
  width: 300px;
  font-size: 25px;
`

export function Proposals() {
 

  return (
    <PanelWrapper title={
      <Fragment>
        Propositions Log<TooltipSpan data-tip data-for='daoInfo'>&#9432;</TooltipSpan>
        {/* @ts-expect-error :( */}
        <ReactTooltip id='daoInfo' type="dark" effect='float' place="bottom">
          <TooltipContent>
            <div>- For demo purposes we skip the delay between when a proposition closed it vote and when it is executed, this time usually allow tokens holders of the DAO to exit the DAO if they do not support the vote result.</div>
          </TooltipContent>
        </ReactTooltip>
      </Fragment>
    }>
      <Web3Guard>
        <ProposalsList/>
      </Web3Guard>
    </PanelWrapper>

  );
}