import React from 'react'
import styled from "styled-components"

const CreditAnchor = styled.a`
  padding: 60px 0 20px 20px;
  font-size: 10px;
  text-align: left;
  width: 100%;
`

export default function Credit() {
  return (
    <CreditAnchor href="https://codepen.io/Olwiba/" target="_blank">
     Illustration by @Olwiba
    </CreditAnchor>
  )
}
