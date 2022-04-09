import React from 'react'
import styled from "styled-components"

const PanelTitle = styled.div`
  font-size: 50px;
  font-weight: bold;

  @media screen and (max-width: 600px) {  
    font-size: 35px;
  }
`

const PanelTop = styled.div<{isFirstPanel: boolean}>`
  margin: 60px auto;

  @media screen and (max-width: 1270px) {  
    margin: ${({isFirstPanel}) => isFirstPanel ? "60px auto" : "120px auto"};
  }

  @media screen and (max-width: 600px) {  
    margin: ${({isFirstPanel}) => isFirstPanel ? "40px auto" : "80px auto"};;
  }
`

const PanelBody = styled.div<{isFirstPanel: boolean}>`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 auto;

  @media screen and (max-width: 1270px) {  
    min-height: ${({isFirstPanel}) => isFirstPanel ? "100vh" : "100%"};
  }
`

export function PanelWrapper({title, children, isFirstPanel}: {title: string | JSX.Element, children: JSX.Element, isFirstPanel?: boolean}) {
  return (
    <PanelBody isFirstPanel={Boolean(isFirstPanel)}>
      <PanelTop isFirstPanel={Boolean(isFirstPanel)}>
        <PanelTitle>{title}</PanelTitle>
      </PanelTop>
      {children}
    </PanelBody>
  )
}
