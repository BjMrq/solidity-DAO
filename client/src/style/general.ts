import { createGlobalStyle } from "styled-components";
import { backGroundColor, lightColor } from "./colors";
import { scrollbar } from "./scrollbar";

export const GlobalStyle = createGlobalStyle`
  html {
    width: 100%;
    height: 100%;
  }
  body {
    ${scrollbar}
    margin:0;
    padding:0;
    overflow-x: hidden;
    background-color: ${backGroundColor};
    color: ${lightColor}
    /* Note, some found can be found in index.css */
  }
  a {
    text-decoration: none !important;
    display: inherit !important;
    color:  inherit !important;
  }
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
  }
`;
