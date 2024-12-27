/* eslint-disable react/no-unknown-property */
import { HiLockClosed, HiPencil } from 'react-icons/hi2';
import { HiBan } from 'react-icons/hi';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import Modal from '../../ui/Modal';
import PropTypes from 'prop-types';
import CreateUserForm from './CreateUserForm.jsx';
import ConfirmAction from '../../ui/ConfirmAction.jsx';
import { useUser } from '../authentication/useUser.js';

function UsersRow({ user }) {
  const { user: currentUser } = useUser();

  const { id, avatar, login, username, email, phone, profile, department, localisation, active } = user;

  const avatarUrl = avatar || 'default-user.jpg';

  return (
    <Table.Row>
      <span name="avatar" alignment="center">
        <img
          src={avatarUrl}
          alt={`Avatar de ${username}`}
          style={{
            width: '25px',
            height: '25px',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      </span>
      <span name="login">{login}</span>
      <span name="username">{username}</span>
      <span name="email">{email}</span>
      <span name="phone">{phone}</span>
      <span name="profile">{profile?.toUpperCase()}</span>
      <span name="department">{department ? department.toUpperCase() : ''}</span>
      <span name="localisation">{localisation ? localisation.toUpperCase() : ''}</span>
      <span name="active" alignment="center">
        {active ? 'Actif' : 'Inactif'}
      </span>
      <span name="actions" alignment="center">
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={id.toString()} />
            <Menus.List id={id.toString()}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />} disabled={currentUser.id === id}>
                  Éditer
                </Menus.Button>
              </Modal.Open>
              <Modal.Open opens="resetUserPassword">
                <Menus.Button icon={<HiLockClosed />}>Réinitialiser le mot de passe</Menus.Button>
              </Modal.Open>
              <Modal.Open opens="activateDeactivate">
                <Menus.Button icon={<HiBan />}>{active ? 'Désactiver' : 'Activer'}</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="activateDeactivate" title="Confirmation">
              <ConfirmAction action={active ? 'deactivate' : 'activate'} id={id} />
            </Modal.Window>
            <Modal.Window name="resetUserPassword" title="Confirmation">
              <ConfirmAction action="resetUserPassword" id={id} />
            </Modal.Window>
            <Modal.Window name="edit" title="Editer un utilisateur">
              <CreateUserForm userToEdit={user} />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </span>
    </Table.Row>
  );
}

UsersRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    avatar: PropTypes.string,
    login: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    profile: PropTypes.string,
    department: PropTypes.string,
    localisation: PropTypes.string,
    active: PropTypes.bool,
  }).isRequired,
};

export default UsersRow;
