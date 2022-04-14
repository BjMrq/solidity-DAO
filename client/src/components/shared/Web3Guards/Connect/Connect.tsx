import React, { Fragment, useContext } from 'react';
import { Web3Context } from "../../../../contracts/context";
import { Button } from "../../../../style/tags/button";


export function Connect() {
  const { initWeb3 } = useContext(Web3Context);
  
  return (
    <Fragment>
      <Button onClick={initWeb3}>Connect to access 🛰</Button>
    </Fragment>
  );
}

