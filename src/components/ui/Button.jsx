import styled, { css } from "styled-components";
import { Link } from "react-router-dom";


const base = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.pill};
  cursor: pointer;
  text-decoration: none;
  transition: transform ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base},
    background ${({ theme }) => theme.transitions.base},
    border-color ${({ theme }) => theme.transitions.base};

  &:disabled,
  &[aria-disabled="true"] {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  ${({ $size }) =>
    $size === "lg"
      ? css`
          padding: 14px 28px;
          font-size: 16px;
        `
      : $size === "sm"
      ? css`
          padding: 8px 16px;
          font-size: 13.5px;
        `
      : css`
          padding: 11px 22px;
          font-size: 15px;
        `}

  ${({ $variant, theme }) => {
    if ($variant === "secondary") {
      return css`
        background: ${theme.colors.surface};
        color: ${theme.colors.text};
        border-color: ${theme.colors.borderStrong};
        box-shadow: ${theme.shadows.xs};
        &:hover {
          transform: translateY(-1px);
          border-color: ${theme.colors.primary};
          color: ${theme.colors.primaryDark};
        }
      `;
    }
    if ($variant === "ghost") {
      return css`
        background: transparent;
        color: ${theme.colors.textMuted};
        &:hover {
          background: ${theme.colors.surfaceAlt};
          color: ${theme.colors.text};
        }
      `;
    }
    if ($variant === "inverse") {
      return css`
        background: ${theme.colors.surface};
        color: ${theme.colors.ink};
        &:hover {
          transform: translateY(-1px);
          box-shadow: ${theme.shadows.md};
        }
      `;
    }
    // primary
    return css`
      background: ${theme.gradients.brand};
      color: #fff;
      box-shadow: ${theme.shadows.glow};
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 22px 60px rgba(109, 94, 252, 0.45);
      }
    `;
  }}

  ${({ $block }) =>
    $block &&
    css`
      width: 100%;
    `}
`;

const StyledButton = styled.button`
  ${base}
`;
const StyledLink = styled(Link)`
  ${base}
`;
const StyledAnchor = styled.a`
  ${base}
`;

export function Button({
  variant = "primary",
  size = "md",
  block = false,
  to,
  href,
  children,
  ...rest
}) {
  const shared = {
    $variant: variant,
    $size: size,
    $block: block,
    ...rest,
  };
  if (to) return <StyledLink to={to} {...shared}>{children}</StyledLink>;
  if (href)
    return (
      <StyledAnchor href={href} {...shared}>
        {children}
      </StyledAnchor>
    );
  return <StyledButton {...shared}>{children}</StyledButton>;
}

export default Button;
