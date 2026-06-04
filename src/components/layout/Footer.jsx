import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiLayers } from "react-icons/fi";
import { Container } from "../ui/Container";

const Wrap = styled.footer`
  margin-top: 80px;
  background: ${({ theme }) => theme.gradients.inkGlow};
  color: ${({ theme }) => theme.colors.textInverse};
  padding: 56px 0 40px;
`;

const Inner = styled(Container)`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: space-between;
  align-items: flex-start;
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 320px;

  .row {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 700;
    font-size: 19px;
  }
  .mark {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 9px;
    background: ${({ theme }) => theme.gradients.brand};
  }
  p {
    color: ${({ theme }) => theme.colors.textInverseMuted};
    font-size: 14px;
    line-height: 1.6;
  }
`;

const Cols = styled.div`
  display: flex;
  gap: 64px;
  flex-wrap: wrap;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  h4 {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.textInverseMuted};
    margin-bottom: 4px;
  }
  a {
    color: ${({ theme }) => theme.colors.textInverse};
    font-size: 14.5px;
    opacity: 0.85;
    transition: opacity 200ms;
    &:hover {
      opacity: 1;
    }
  }
`;

const Base = styled(Container)`
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textInverseMuted};
`;

export function Footer() {
  return (
    <Wrap>
      <Inner>
        <Brand>
          <span className="row">
            <span className="mark">
              <FiLayers size={17} />
            </span>
            Cataloge
          </span>
          <p>
            Turn raw brand and product notes into a polished, editable one-page
            catalog — powered by AI.
          </p>
        </Brand>

        <Cols>
          <Col>
            <h4>Product</h4>
            <Link to="/templates">Templates</Link>
            <Link to="/create">Create catalog</Link>
          </Col>
          <Col>
            <h4>Resources</h4>
            <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer">
              API docs
            </a>
            <a href="http://localhost:8000/health" target="_blank" rel="noreferrer">
              Service health
            </a>
          </Col>
        </Cols>
      </Inner>
      <Base>© {new Date().getFullYear()} Cataloge — AI Catalog Maker.</Base>
    </Wrap>
  );
}

export default Footer;
