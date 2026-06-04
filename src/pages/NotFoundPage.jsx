import styled from "styled-components";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";

const Wrap = styled(Container)`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;

  .code {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(64px, 14vw, 120px);
    font-weight: 700;
    background: ${({ theme }) => theme.gradients.brand};
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    line-height: 1;
  }
  p {
    color: ${({ theme }) => theme.colors.textMuted};
    max-width: 420px;
  }
`;

export function NotFoundPage() {
  return (
    <Wrap>
      <span className="code">404</span>
      <h1>Page not found</h1>
      <p>The page you’re looking for doesn’t exist or has moved.</p>
      <Button to="/">Back home</Button>
    </Wrap>
  );
}

export default NotFoundPage;
