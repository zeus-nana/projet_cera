import styled from 'styled-components';
import { useUser } from '../features/authentication/useUser.js';

import { useLogout } from '../features/authentication/useLogout.js';
import Modal from './Modal.jsx';
import Menus from './Menus.jsx';
import { HiArrowRightOnRectangle, HiMiniChevronDown, HiPencil } from 'react-icons/hi2';
import ChangePasswordForm from '../features/authentication/ChangePasswordForm.jsx';

const StyledHeaderMenu = styled.ul`
  display: flex;
  gap: 0.4rem;
`;

function HeaderMenu() {
  const { user } = useUser();
  const { logout, isLoading } = useLogout();

  return (
    <StyledHeaderMenu>
      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={user.id.toString()} icon={<HiMiniChevronDown />} />
          <Menus.List id={user.id.toString()}>
            <Modal.Open opens="editPassword">
              <Menus.Button icon={<HiPencil />}>Modifier mon mot de passe</Menus.Button>
            </Modal.Open>

            <Menus.Button icon={<HiArrowRightOnRectangle />} onClick={() => logout()} disabled={isLoading}>
              Se déconnecter
            </Menus.Button>
          </Menus.List>

          <Modal.Window name="editPassword" title="Modifier mon mot de passe">
            <ChangePasswordForm userId={user.id} onPasswordChanged={() => console.log('Changement mot de passe')} />
          </Modal.Window>
        </Menus.Menu>
      </Modal>
    </StyledHeaderMenu>
  );
}

export default HeaderMenu;
