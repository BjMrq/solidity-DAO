import { css } from "styled-components";
import { border, borderRadius } from "./characteristics";

export const bordered = css`
  border-radius: ${borderRadius};
  border: ${border};
`;

export const inputLike = css`
  height: 45px;
  width: 100%;
  ${bordered}
  padding: 9px;
  outline: 0;
  font-size: 1.5rem;
  font: normal 13px/100% Verdana, Tahoma, sans-serif;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #fff;
  &:hover {
    background-color: #f5f5f5;
  }
  &:focus {
    background-color: #f5f5f5;
  }
  @media screen and (max-width: 600px) {
    height: 35px;
    font-size: 1.1rem;
  }
`;
