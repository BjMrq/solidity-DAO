import styled, { css } from "styled-components";
import { lightColor, neutralColor, secondColor } from "../colors";
import { bordered } from "../input-like";

export const disabledButton = css`
  &:disabled {
    background-color: ${neutralColor};
    color: ${lightColor};
    cursor: default;
    filter: none;
  }
`;

const ButtonBaseCSS = css`
  appearance: none;
  background-color: #ffffff;
  ${bordered}
  box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;
  box-sizing: border-box;
  color: ${secondColor};
  cursor: pointer;
  display: inline-block;
  font-weight: bold;
  line-height: 20px;
  list-style: none;
  position: relative;
  transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: top;
  white-space: nowrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  &:hover {
    background-color: #f7f3f3;
    text-decoration: none;
    transition-duration: 0.1s;
  }
  ${disabledButton}
  &:active {
    filter: brightness(95%);
    box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
    transition: none 0s;
  }
  &:focus {
    filter: brightness(95%);
    outline: 1px transparent;
  }
  &:before {
    display: none;
  }
  &:-webkit-details-marker {
    display: none;
  }
  @media screen and (max-width: 600px) {
    height: 35px;
    font-size: 1.1rem;
    padding: 0 10px;
  }
`;

//TODO blocked prop
export const Button = styled.button`
  ${ButtonBaseCSS}
  height: 45px;
  padding: 6px 16px;
  font-size: 24px;
`;

export const SmallButton = styled.button`
  ${ButtonBaseCSS}
  height: 35px;
  padding: 6px;
  font-size: 14px;

  @media screen and (max-width: 600px) {
    height: 25px;
    padding: 6px;
    font-size: 10px;
  }
`;
