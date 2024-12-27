/* eslint-disable react/no-unknown-property */
import PropTypes from 'prop-types';
import { HiPencil } from 'react-icons/hi';
import Modal from '../../../ui/Modal';
import CreateUpdatePermissionForm from './CreateUpdatePermissionForm';
import Menus from '../../../ui/Menus';
import Table from '../../../ui/Table';

function PermissionRow({ permission }) {
  const { id, nom, description, created_by, menu } = permission;

  return (
    <Table.Row>
      <span name="nom">{nom}</span>
      <span name="description">{description}</span>
      <span name="menu">{menu}</span>
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

            <Modal.Window name="edit" title="Editer une permission">
              <CreateUpdatePermissionForm permissionToEdit={permission} />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </span>
    </Table.Row>
  );
}

PermissionRow.propTypes = {
  permission: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nom: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    created_by: PropTypes.string.isRequired,
    menu: PropTypes.string.isRequired,
  }).isRequired,
};

export default PermissionRow;
