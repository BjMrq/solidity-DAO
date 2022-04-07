import React, { useContext } from 'react';
import { ChromePicker } from 'react-color';
import styled from "styled-components";
import { Web3Context } from "../../../../contracts/context";
import { borderRadius } from "../../../../style/characteristics";
import { lightColor } from "../../../../style/colors";
import { inputLike } from "../../../../style/input-like";
import { Button } from "../../../../style/tags/button";


const NewPropositionCardDiv = styled.div`
  margin: 0 auto;
  padding: 40px;
  border-radius: ${borderRadius};
  border: 2px solid ${lightColor};
  box-shadow: 11px 16px 8px rgba(0, 0, 0, 0.4);
`

const NewProposalTitle = styled.div`
  font-weight: bold;
  font-size: 24px;
  text-overflow: ellipsis;
  margin-bottom: 40px;
`

const PropositionElements = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
`
const PropositionColorPickerDiv = styled.div`
  margin: 0 auto 40px auto;
  min-width: 40%;
`

const PropositionDescriptionDiv = styled.div`
  flex-grow: 1;
  min-height: 100%;
  margin: 0 auto 40px auto;
  min-width: 40%;
`

const PropositionDescriptionInput = styled.textarea`
  ${inputLike}
  width:100%;
  height:100%;
  min-height: 246px;
  border-radius: ${borderRadius};
`

const PropositionButtonDiv = styled.div`
  width: 100%;
`

export function NewProposal() {
  const { submitNewColorPropositionToDao, canParticipateToDao } = useContext(Web3Context);

  const [proposedColor, setProposedColor] = React.useState('#ffffff');

  const [propositionDescription, setPropositionDescription] = React.useState('');

  const submitProposition = async () => {
    await submitNewColorPropositionToDao({color: proposedColor, description: propositionDescription})
    setPropositionDescription("")
  }
  

  return (
    <NewPropositionCardDiv>
      <NewProposalTitle>
        Propose a new Astro Light color
      </NewProposalTitle>
      <PropositionElements>
        <PropositionColorPickerDiv>
          {/* Styling of color picker in index.css */}
          <ChromePicker
            color={proposedColor}
            onChange={(color: {hex: string}) => setProposedColor(color.hex)}/>
        </PropositionColorPickerDiv>
        <div style={{ minWidth: "5%"}}></div>
        <PropositionDescriptionDiv>
          <PropositionDescriptionInput 
            placeholder="Describe why you want to make this change to the DAO.." 
            spellCheck={true}
            onChange= {({target: {value}}) => setPropositionDescription(value)}
            value={propositionDescription}
          />
        </PropositionDescriptionDiv>
        <PropositionButtonDiv>
          {
            canParticipateToDao 
              ?
              <Button 
                style={{width: "100%", whiteSpace: "normal"}}
                onClick={submitProposition}>
                  Emit Proposition 📡
              </Button> :
              <Button 
                style={{width: "100%", whiteSpace: "normal"}}
                disabled
              >
                Hold ASTRO to make a proposition
              </Button>
          }
        </PropositionButtonDiv>
      </PropositionElements>
    </NewPropositionCardDiv>
  );
}