import React, { Fragment, useContext } from 'react';
import { Web3Context } from "../../../contracts/context";
import { AddMetamask } from "../../shared/AddMetamask/AddMetamask";


export function AddSatiMetamask() {
  const { contracts: {satiTokenContract} } = useContext(Web3Context);
  
  return (
    <Fragment>
      {satiTokenContract && <AddMetamask displayText="Add Sati" tokenContract={satiTokenContract}/>}
    </Fragment>
  );
}