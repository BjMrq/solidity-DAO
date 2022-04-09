import React, { Fragment, useContext } from 'react';
import { Web3Context } from "../../../contracts/context";
import { AddMetamask } from "../../shared/AddMetamask/AddMetamask";


export function AddAstroMetamask() {
  const { contracts: {astroToken} } = useContext(Web3Context);
  
  return (
    <Fragment>
      {astroToken && <AddMetamask displayText="Add Astro" tokenContract={astroToken}/>}
    </Fragment>
  );
}