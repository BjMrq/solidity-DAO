import { css } from "styled-components";
import { mainColor, lightMainColor, lightSecondColor } from "./colors";

export const scrollbar = css`
  overflow-y: auto;
  background-color: #fcfafa;
  border-radius: 8px;
  &::-webkit-scrollbar {
    width: 4px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  }
  &::-webkit-scrollbar-thumb {
    background-image: -webkit-gradient(
      linear,
      left bottom,
      left top,
      color-stop(0.02, ${lightSecondColor}),
      color-stop(0.44, ${lightMainColor}),
      color-stop(0.72, ${mainColor}),
      color-stop(0.86, ${mainColor})
    );
  }
`;

export const scrollBarObject = {
  WebkitScrollbar: {
    width: "45px",
    boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.1)",
  },
  WebkitScrollbarThumb: {
    backgroundImage: `-webkit-gradient(linear, left bottom, left top, color-stop(0.02, ${lightSecondColor}), color-stop(0.44, ${lightMainColor}), color-stop(0.72, ${mainColor}), color-stop(0.86, ${mainColor})`,
  },
};
