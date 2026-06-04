import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
`;

export function Layout() {
  return (
    <Shell>
      <Navbar />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Shell>
  );
}

export default Layout;
