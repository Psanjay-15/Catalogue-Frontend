import styled from "styled-components";

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base},
    border-color ${({ theme }) => theme.transitions.base};

  ${({ $interactive, theme }) =>
    $interactive &&
    `
      cursor: pointer;
      &:hover {
        transform: translateY(-4px);
        box-shadow: ${theme.shadows.lg};
        border-color: ${theme.colors.primary};
      }
    `}
`;

export default Card;
