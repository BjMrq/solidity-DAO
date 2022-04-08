import styled from "styled-components";
import { borderRadius } from "../../../../../style/characteristics";
import { lightColor } from "../../../../../style/colors";
import {
  buttonEffectDarker,
  disabledButton,
} from "../../../../../style/tags/button";

export const GradientUnderline = styled.div`
  background-color: ${lightColor};
  width: 30%;
  border-radius: 0;
  height: 4px;
`;

export const ProposalDescriptionLabel = styled.div`
  text-align: left;
  margin: 20px auto 10px auto;
  width: 100%;
  font-size: 22px;
  font-weight: 800;
`;

export const ProposalDescriptionSubLabel = styled.div`
  text-align: left;
  margin: 20px auto 0 auto;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
`;

export const ProposalDescription = styled.div`
  text-align: left;
  width: 100%;
  font-size: 18px;
  margin: 20px 0 40px 0;
`;

export const ActionWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const ActionOptionButton = styled.div<{
  color: string;
  disabled?: boolean;
}>`
  height: 45px;
  padding: 5px;
  font-weight: bold;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: ${borderRadius};
  width: 100%;

  background-color: ${({ color }) => color};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  ${({ disabled }) => (disabled ? disabledButton : buttonEffectDarker)}
`;
