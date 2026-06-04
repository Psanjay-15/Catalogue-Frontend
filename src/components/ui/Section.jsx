import styled from "styled-components";
import { Container } from "./Container";

const Wrap = styled.section`
  padding: ${({ $tight }) => ($tight ? "40px 0" : "72px 0")};
`;

const Head = styled.div`
  text-align: ${({ $align }) => $align || "center"};
  max-width: ${({ $align }) => ($align === "left" ? "640px" : "720px")};
  margin: ${({ $align }) => ($align === "left" ? "0 0 36px" : "0 auto 44px")};

  .eyebrow {
    display: inline-block;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 12px;
  }
  h2 {
    font-size: clamp(26px, 4vw, 38px);
  }
  p {
    margin-top: 14px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 17px;
    line-height: 1.6;
  }
`;

export function Section({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tight = false,
  children,
  id,
}) {
  return (
    <Wrap $tight={tight} id={id}>
      <Container>
        {(eyebrow || title || subtitle) && (
          <Head $align={align}>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </Head>
        )}
        {children}
      </Container>
    </Wrap>
  );
}

export default Section;
