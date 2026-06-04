import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  * { margin: 0; padding: 0; }

  html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }

  body {
    font-family: ${({ theme }) => theme.fonts.sans};
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.55;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  h1, h2, h3, h4 {
    font-family: ${({ theme }) => theme.fonts.display};
    line-height: 1.12;
    letter-spacing: -0.02em;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }

  a { color: inherit; text-decoration: none; }

  button, input, textarea, select { font: inherit; color: inherit; }

  img { max-width: 100%; display: block; }

  ul, ol { list-style: none; }

  ::selection {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Slim, themed scrollbar */
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.borderStrong};
    border-radius: 999px;
    border: 2px solid ${({ theme }) => theme.colors.bg};
  }
`;

export default GlobalStyle;
