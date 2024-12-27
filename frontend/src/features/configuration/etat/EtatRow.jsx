/* eslint-disable react/no-unknown-property */
import PropTypes from 'prop-types';
import { HiPencil } from 'react-icons/hi';
import CreateUpdateEtatForm from './CreateUpdateEtatForm.jsx';
import Modal from '../../../ui/Modal.jsx';
import Table from '../../../ui/Table.jsx';
import Menus from '../../../ui/Menus.jsx';

function EtatRow({ etat }) {
  const { id, etat: etatNom, created_by, created_at, updated_at, updated_by } = etat;

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
      <span name="etat">{etatNom}</span>
      <span name="created_by" alignment="center">
        {created_by}
      </span>
      <span name="updated_by" alignment="center">
        {updated_by}
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

            <Modal.Window name="edit" title="Editer un état">
              <CreateUpdateEtatForm etatToEdit={etat} />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </span>
    </Table.Row>
  );
}

EtatRow.propTypes = {
  etat: PropTypes.shape({
    id: PropTypes.number.isRequired,
    etat: PropTypes.string.isRequired,
    created_by: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    updated_by: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
  }).isRequired,
};

export default EtatRow;
