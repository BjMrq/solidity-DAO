import React, { useContext } from 'react';
import { ChromePicker } from 'react-color';
import styled from "styled-components";
import { Web3Context } from "../../../../contracts/context";
import { backGroundColor } from "../../../../style/colors";
import { inputLike } from "../../../../style/input-like";
import { Button } from "../../../../style/tags/button";


const NewPropositionCardDiv = styled.div`
  width: 100%;
  margin: 60px auto 20px auto;
`

const NewProposalContent = styled.div`
  padding: 30px;
  background-color: ${backGroundColor};
  font-weight: bold;
  font-size: 24px;
  text-overflow: ellipsis;
`

const PropositionElements = styled.div`
  display: flex;
  background-color: ${backGroundColor};
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
`
const PropositionColorPickerDiv = styled.div`
  margin: 30px auto 0 auto;
  padding: 0 20px;
`

const PropositionDescriptionDiv = styled.div`
  margin-top: 30px;
  flex-grow: 1;
  min-height: 100%;
  padding: 0 20px;
`

const PropositionDescriptionInput = styled.textarea`
  ${inputLike}
  width:100%;
  height:100%;
  min-height: 246px;
`

const PropositionButtonDiv = styled.div`
  margin-top: 30px;
  width: 100%;
  padding: 0 20px;
`

export function NewProposal() {
  const { submitNewColorPropositionToDao } = useContext(Web3Context);

  const [proposedColor, setProposedColor] = React.useState('#ffffff');

  const [propositionDescription, setPropositionDescription] = React.useState('');

  const submitProposition = async () => {
    await submitNewColorPropositionToDao({color: proposedColor, description: propositionDescription})
    setPropositionDescription("")
  }
  

  return (
    <NewPropositionCardDiv>
      <NewProposalContent>
        Propose a new color for the animation to the DAO
      </NewProposalContent>
      <PropositionElements>
        <PropositionColorPickerDiv>
          <ChromePicker
            color={proposedColor}
            onChange={(color: {hex: string}) => setProposedColor(color.hex)}/>
        </PropositionColorPickerDiv>
        <PropositionDescriptionDiv>
          <PropositionDescriptionInput 
            placeholder="Describe why you want to make this change to the DAO.." 
            spellCheck={true}
            onChange= {({target: {value}}) => setPropositionDescription(value)}
            value={propositionDescription}
          />
        </PropositionDescriptionDiv>
        <PropositionButtonDiv>
          <Button 
            style={{width: "100%"}}
            onClick={submitProposition}>
             Propose
          </Button>
        </PropositionButtonDiv>
      </PropositionElements>
    </NewPropositionCardDiv>
  );
}