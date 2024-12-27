import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 32rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;

  @media (max-width: 1200px) {
    grid-template-columns: 24rem 1fr;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
  }
`;

const Main = styled.main`
  background-color: var(--color-grey-100);
  padding: 4rem 4.8rem 6.4rem;
  border-radius: 12px;
  overflow: auto;

  @media (max-width: 1200px) {
    padding: 3rem 3.6rem 4.8rem;
  }

  @media (max-width: 768px) {
    padding: 2rem 2.4rem 3.2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1.8rem 2.4rem;
  }
`;

const Container = styled.div`
  max-width: 140rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;

  @media (max-width: 1200px) {
    gap: 2.4rem;
  }

  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

function AppLayout() {
  return (
    <StyledAppLayout>
      <Header />
      <Sidebar />
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
}

export default AppLayout;
