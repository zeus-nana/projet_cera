import styled from 'styled-components';
import HeaderMenu from './HeaderMenu.jsx';
import UserAvatar from '../features/authentication/UserAvatar.jsx';
import Menus from './Menus.jsx';

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);

  display: flex;
  gap: 0.4rem;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 1366px) {
    padding: 1rem 3.6rem;
  }

  @media (max-width: 768px) {
    padding: 0.8rem 2.4rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 1.2rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
`;

function Header() {
  return (
    <StyledHeader>
      <HeaderContent>
        <Menus>
          <UserAvatar />
          <HeaderMenu />
        </Menus>
      </HeaderContent>
    </StyledHeader>
  );
}

export default Header;
