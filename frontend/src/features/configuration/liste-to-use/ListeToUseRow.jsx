/* eslint-disable react/no-unknown-property */
import PropTypes from 'prop-types';
import { HiPencil } from 'react-icons/hi';
import Modal from '../../../ui/Modal.jsx';
import Table from '../../../ui/Table.jsx';
import Menus from '../../../ui/Menus.jsx';
import CreateUpdateListeToUseForm from './CreateUpdateListeToUseForm.jsx';

function ListeToUseRow({ liste }) {
  const { id, code, libelle, usage, created_by_login, created_at, updated_at, updated_by_login } = liste;

  const formattedDateCreate = new Date(created_at).toLocaleString('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  const formattedDateModif = new Date(updated_at).toLocaleString('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  return (
    <Table.Row>
      <span name="code">{code}</span>
      <span name="libelle">{libelle}</span>
      <span name="usage">{usage}</span>
      <span name="created_by" alignment="center">
        {created_by_login}
      </span>
      <span name="updated_by" alignment="center">
        {updated_by_login}
      </span>
      <span name="created_at" alignment="center">
        {formattedDateCreate}
      </span>
      <span name="updated_at" alignment="center">
        {formattedDateModif}
      </span>
      <span name="actions" alignment="center">
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={id.toString()} />
            <Menus.List id={id.toString()}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Éditer</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit" title="Editer une liste">
              <CreateUpdateListeToUseForm listeToEdit={liste} />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </span>
    </Table.Row>
  );
}

ListeToUseRow.propTypes = {
  liste: PropTypes.shape({
    id: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
    libelle: PropTypes.string.isRequired,
    usage: PropTypes.string.isRequired,
    created_by_login: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    updated_by_login: PropTypes.string,
    updated_at: PropTypes.string.isRequired,
  }).isRequired,
};

export default ListeToUseRow;
