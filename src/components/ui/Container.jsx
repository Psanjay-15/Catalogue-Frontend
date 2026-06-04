import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding-inline: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-inline: 18px;
  }
`;

export default Container;
