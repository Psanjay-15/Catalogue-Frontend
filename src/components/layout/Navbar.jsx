import { NavLink, Link } from "react-router-dom";
import styled from "styled-components";
import { FiLayers } from "react-icons/fi";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  height: ${({ theme }) => theme.layout.navHeight};
  display: flex;
  align-items: center;
  background: rgba(251, 250, 255, 0.82);
  backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Inner = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 19px;
  letter-spacing: -0.02em;

  .mark {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: ${({ theme }) => theme.gradients.brand};
    color: #fff;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const NavItem = styled(NavLink)`
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 14.5px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
  &.active {
    color: ${({ theme }) => theme.colors.primaryDark};
    background: ${({ theme }) => theme.colors.primarySoft};
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export function Navbar() {
  return (
    <Bar>
      <Inner>
        <Brand to="/">
          <span className="mark">
            <FiLayers size={18} />
          </span>
          Cataloge
        </Brand>

        <Nav>
          <NavItem to="/" end>
            Home
          </NavItem>
          <NavItem to="/templates">Templates</NavItem>
          <NavItem to="/create">Create</NavItem>
          <NavItem to="/saved">Saved</NavItem>
        </Nav>

        <Right>
          <Button to="/create" size="sm">
            Start building
          </Button>
        </Right>
      </Inner>
    </Bar>
  );
}

export default Navbar;
