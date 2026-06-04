import styled, { css } from "styled-components";

const tones = {
  neutral: (t) => css`
    background: ${t.colors.surfaceAlt};
    color: ${t.colors.textMuted};
  `,
  brand: (t) => css`
    background: ${t.colors.primarySoft};
    color: ${t.colors.primaryDark};
  `,
  accent: (t) => css`
    background: ${t.colors.accentSoft};
    color: #c2410c;
  `,
  success: (t) => css`
    background: ${t.colors.successSoft};
    color: ${t.colors.success};
  `,
  danger: (t) => css`
    background: ${t.colors.dangerSoft};
    color: ${t.colors.danger};
  `,
};

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;
  ${({ tone = "neutral", theme }) => tones[tone](theme)}
`;

export default Badge;
