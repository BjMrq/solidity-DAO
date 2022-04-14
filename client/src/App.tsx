import React from 'react';
import styled from "styled-components";
import Credit from "./components/Credit/Credit";
import { AnimationNewProposal } from "./components/Dao/AnimationNewProposal/AnimationNewProposal";
import { Proposals } from "./components/Dao/Proposals/Proposals";
import { Toast } from "./components/Toast/Toast";
import { TokenSales } from "./components/TokenSales/TokenSales";
import { Whitepaper } from "./components/Whitepaper/Whitepaper";
import Web3ContextProvider from "./contracts/context";
import { lightColor } from "./style/colors";
import { GlobalStyle } from "./style/general";


const AppBody = styled.div`
  text-align: center;
  display: flex;
  height: 100%;
  width: 100%;
  color: ${lightColor};
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  font-size: calc(8px + 2vmin);
`

const Panel = styled.div`
  width: 42%;
  margin: 0;
  padding: 0 4%;
  height: 100%;
 @media screen and (max-width: 1270px) { 
    width: 92%;
    padding: 0 4%;
 }
`

function App() {

  return ( 
    <Web3ContextProvider>
      <GlobalStyle/>
      <AppBody>
        <Panel><TokenSales/></Panel>
        <Panel><Whitepaper/></Panel>
        <Panel><AnimationNewProposal/></Panel>
        <Panel><Proposals/></Panel>
        <Credit />
        <Toast />
      </AppBody>
    </Web3ContextProvider>
  );
}

export default App;
