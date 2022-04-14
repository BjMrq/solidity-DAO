import React, { Fragment } from 'react';
import styled from "styled-components";
import { Web3Guard } from "../../shared/Web3Guards/Web3Guard/Web3Guard";

const ActionDescription= styled.div`
  justify-self: start;
  text-align: justify;
  width: 100%;
  font-size: 0.75em;
  margin: 14px 0;
`

export function TokenSaleContent({
  actionDescription, 
  children
}: 
{
  actionDescription: string, 
  children: JSX.Element | JSX.Element[]
}) {

  return (
    <Fragment>
      <ActionDescription>&#9432; {actionDescription}</ActionDescription>
      <Web3Guard displayButton>
        <Fragment>
          {children}
        </Fragment>
      </Web3Guard>
    </Fragment>
  )
} 