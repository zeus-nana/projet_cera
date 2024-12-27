/* eslint-disable react/no-unknown-property */
import PropTypes from 'prop-types';
import { HiMiniCheckCircle, HiMiniXMark } from 'react-icons/hi2';
import { useUpdateUserFonctionStatus } from './useUpdateUserFonctionStatus.js';
import Modal from '../../../ui/Modal';
import Menus from '../../../ui/Menus';
import Table from '../../../ui/Table';
import ConfirmAction from '../../../ui/ConfirmAction.jsx';

function AttributionFonctionRow({ attribution, onCloseModal }) {
  const { id, login, fonction, active, created_by, created_at, updated_by, updated_at } = attribution;
  const { isUpdating, updateUserFonction } = useUpdateUserFonctionStatus(onCloseModal);

  const formattedDate = `${new Date(created_at).toLocaleDateString('fr-FR')} 
  : ${new Date(created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;

  const formattedDateUpdate =
    new Date(updated_at).toLocaleDateString('fr-FR') +
    ' : ' +
    new Date(updated_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <Table.Row>
      <span name="login" alignment="center">
        {login}
      </span>
      <span name="fonction" alignment="center">
        {fonction}
      </span>
      <span name="statut" alignment="center">
        {active ? 'Actif' : 'Inactif'}
      </span>
      <span name="create_by" alignment="center">
        {created_by}
      </span>
      <span name="created_at" alignment="center">
        {formattedDate}
      </span>
      <span name="updated_by" alignment="center">
        {updated_by}
      </span>
      <span name="updated_at" alignment="center">
        {formattedDateUpdate}
      </span>
      <span name="actions" alignment="center">
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={id.toString()} />
            <Menus.List id={id.toString()}>
              <Modal.Open opens="action">
                <Menus.Button icon={active ? <HiMiniXMark /> : <HiMiniCheckCircle />}>
                  {active ? 'Désactiver' : 'Activer'}
                </Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="action" title="Confirmation">
              <ConfirmAction
                onCloseModal={onCloseModal}
                disabled={isUpdating}
                onConfirm={() => updateUserFonction({ id, action: active ? 'disable' : 'enable' })}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </span>
    </Table.Row>
  );
}

AttributionFonctionRow.propTypes = {
  attribution: PropTypes.shape({
    id: PropTypes.number,
    login: PropTypes.string,
    fonction: PropTypes.string,
    active: PropTypes.bool,
    created_by: PropTypes.string,
    updated_by: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  }).isRequired,
  onCloseModal: PropTypes.func,
};

export default AttributionFonctionRow;
