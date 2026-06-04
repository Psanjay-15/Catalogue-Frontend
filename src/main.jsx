import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import App from "./App.jsx";
import { theme } from "./styles/theme";
import { GlobalStyle } from "./styles/GlobalStyle";
import ScrollToTop from "./components/layout/ScrollToTop";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
