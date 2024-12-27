/* eslint-disable react/no-unknown-property */
import PropTypes from 'prop-types';
import { HiPencil } from 'react-icons/hi';
import Modal from '../../../ui/Modal.jsx';
import CreateUpdateMenuForm from './CreateUpdateMenuForm.jsx';
import Menus from '../../../ui/Menus.jsx';
import Table from '../../../ui/Table.jsx';

function MenuRow({ menu }) {
  const { id, nom, description, created_by } = menu;

  return (
    <Table.Row>
      <span name="nom">{nom}</span>
      <span name="description">{description}</span>
      <span name="create_by">{created_by}</span>
      <span name="actions" alignment="center">
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={id.toString()} />
            <Menus.List id={id.toString()}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Éditer</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit" title="Editer un menu">
              <CreateUpdateMenuForm menuToEdit={menu} />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </span>
    </Table.Row>
  );
}

MenuRow.propTypes = {
  menu: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nom: PropTypes.string.isRequired,
    created_by: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default MenuRow;
