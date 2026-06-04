import styled, { keyframes } from "styled-components";

const spin = keyframes`to { transform: rotate(360deg); }`;

export const Spinner = styled.span`
  display: inline-block;
  width: ${({ size = 20 }) => size}px;
  height: ${({ size = 20 }) => size}px;
  border-radius: 50%;
  border: ${({ size = 20 }) => Math.max(2, Math.round(size / 9))}px solid
    ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme, $inverse }) =>
    $inverse ? "#fff" : theme.colors.primary};
  animation: ${spin} 0.7s linear infinite;
`;

export default Spinner;
