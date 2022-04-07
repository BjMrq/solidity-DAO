import React, { Fragment, useContext } from 'react';
import { Web3Context } from "../../../contracts/context";
import { AddMetamask } from "../../shared/AddMetamask/AddMetamask";


export function AddAstroMetamask() {
  const { contracts: {astroTokenContract} } = useContext(Web3Context);
  
  return (
    <Fragment>
      {astroTokenContract && <AddMetamask displayText="Add Astro Light" tokenContract={astroTokenContract}/>}
    </Fragment>
  );
}