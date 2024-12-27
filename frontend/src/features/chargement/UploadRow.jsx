import { HiOutlineDocumentText, HiOutlineTrash } from 'react-icons/hi';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import Modal from '../../ui/Modal';
import PropTypes from 'prop-types';
import ConfirmAction from '../../ui/ConfirmAction.jsx';

function UploadRow({ upload }) {
  const { id, create_at, etat, nombre_succes, nombre_echec, create_by, statut } = upload;

  return (
    <Table.Row>
      <div>{id}</div>
      <div>{new Date(create_at).toLocaleString()}</div>
      <div>{etat}</div>
      <div>{nombre_succes}</div>
      <div>{nombre_echec}</div>
      <div>{create_by}</div>
      <div>{statut === 'e' ? 'En cours' : 'Terminé'}</div>
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={id.toString()} />
            <Menus.List id={id.toString()}>
              <Modal.Open opens="viewDetails">
                <Menus.Button icon={<HiOutlineDocumentText />}>Voir les détails</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="deleteUpload">
                <Menus.Button icon={<HiOutlineTrash />}>Supprimer</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="viewDetails">
              {/* Implement a details view component */}
              <div>Détails {id}</div>
            </Modal.Window>

            <Modal.Window name="deleteUpload" title="Confirmation">
              <ConfirmAction action="deleteUpload" id={id} />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

UploadRow.propTypes = {
  upload: PropTypes.object.isRequired,
};

export default UploadRow;
