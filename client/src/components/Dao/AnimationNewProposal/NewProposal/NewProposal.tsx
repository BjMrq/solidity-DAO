import React, { useContext } from 'react';
import { ChromePicker } from 'react-color';
import styled from "styled-components";
import { Web3Context } from "../../../../contracts/context";
import { gradientBackgroundCss } from "../../../../style/card";
import { borderRadius } from "../../../../style/characteristics";
import { lightColor } from "../../../../style/colors";
import { inputLike } from "../../../../style/input-like";
import { Button } from "../../../../style/tags/button";


const NewProposalCardDiv = styled.div`
  margin: 0 auto;
  padding: 40px;
  border-radius: ${borderRadius};
  /* border: 2px solid ${lightColor}; */
  box-shadow: 11px 16px 8px rgba(0, 0, 0, 0.4);
  ${gradientBackgroundCss}
`

const NewProposalTitle = styled.div`
  font-weight: bold;
  font-size: 24px;
  text-overflow: ellipsis;
  margin-bottom: 40px;
`

const ProposalElements = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
`
const ProposalColorPickerDiv = styled.div`
  margin: 0 auto 40px auto;
  min-width: 40%;
`

const ProposalDescriptionDiv = styled.div`
  flex-grow: 1;
  min-height: 100%;
  margin: 0 auto 40px auto;
  min-width: 40%;
`

const ProposalDescriptionInput = styled.textarea`
  ${inputLike}
  width:100%;
  height:100%;
  min-height: 246px;
  border-radius: ${borderRadius};
`

const ProposalButtonDiv = styled.div`
  width: 100%;
`

export function NewProposal() {
  const { submitNewColorProposalToDao, canParticipateToDao } = useContext(Web3Context);

  const [proposedColor, setProposedColor] = React.useState('#ffffff');

  const [proposalDescription, setProposalDescription] = React.useState('');

  const submitProposal = async () => {
    await submitNewColorProposalToDao({color: proposedColor, description: proposalDescription})
    setProposalDescription("")
  }
  

  return (
    <NewProposalCardDiv>
      <NewProposalTitle>
        Propose a new Astro Light color
      </NewProposalTitle>
      <ProposalElements>
        <ProposalColorPickerDiv>
          {/* Styling of color picker in index.css */}
          <ChromePicker
            color={proposedColor}
            onChange={(color: {hex: string}) => setProposedColor(color.hex)}/>
        </ProposalColorPickerDiv>
        <div style={{ minWidth: "5%"}}></div>
        <ProposalDescriptionDiv>
          <ProposalDescriptionInput 
            placeholder="Describe why you want to make this change to the DAO.." 
            spellCheck={true}
            onChange= {({target: {value}}) => setProposalDescription(value)}
            value={proposalDescription}
          />
        </ProposalDescriptionDiv>
        <ProposalButtonDiv>
          {
            canParticipateToDao 
              ?
              <Button 
                style={{width: "100%", whiteSpace: "normal"}}
                onClick={submitProposal}>
                  Emit Proposal 📡
              </Button> :
              <Button 
                style={{width: "100%", whiteSpace: "normal"}}
                disabled
              >
                Hold ASTRO to make a proposal
              </Button>
          }
        </ProposalButtonDiv>
      </ProposalElements>
    </NewProposalCardDiv>
  );
}