import { css } from "styled-components";
import {
  lightMainColor,
  mainColor,
  secondColor,
  lightSecondColor,
} from "./colors";

export const gradientBackgroundCss = css`
  border-radius: 6px;

  background: linear-gradient(
    132deg,
    ${lightMainColor},
    ${mainColor},
    ${secondColor},
    ${lightSecondColor}
  );

  background-size: 300% 300%;

  -webkit-animation: GradientMove 55s ease infinite;
  -moz-animation: GradientMove 55s ease infinite;
  animation: GradientMove 55s ease infinite;

  @-webkit-keyframes GradientMove {
    0% {
      background-position: 43% 0%;
    }
    50% {
      background-position: 58% 100%;
    }
    100% {
      background-position: 43% 0%;
    }
  }
  @-moz-keyframes GradientMove {
    0% {
      background-position: 43% 0%;
    }
    50% {
      background-position: 58% 100%;
    }
    100% {
      background-position: 43% 0%;
    }
  }
  @keyframes GradientMove {
    0% {
      background-position: 43% 0%;
    }
    50% {
      background-position: 58% 100%;
    }
    100% {
      background-position: 43% 0%;
    }
  }
`;
