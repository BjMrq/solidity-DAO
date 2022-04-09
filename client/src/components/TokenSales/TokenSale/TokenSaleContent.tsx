import React, { Fragment } from 'react';
import styled from "styled-components";
import { Button } from "../../../style/tags/button";

const ActionDescription= styled.div`
  justify-self: start;
  text-align: justify;
  width: 100%;
  font-size: 0.75em;
  margin: 14px 0;
`

export function TokenSaleContent({actionDescription, children, callToAction}: 
{actionDescription: string, children: JSX.Element | JSX.Element[], callToAction?: {display: string, callback: () => void}}) {

  return (
    <Fragment>
      <ActionDescription>&#9432; {actionDescription}</ActionDescription>
      {children}
      {callToAction && <div style={{width: "100%"}}>
        <Button onClick={callToAction.callback}>{callToAction.display}</Button>
      </div>}
    </Fragment>
  )
} 