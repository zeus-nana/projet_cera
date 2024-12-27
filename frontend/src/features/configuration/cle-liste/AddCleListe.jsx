import CreateUpdateCleListeForm from './CreateUpdateCleListeForm.jsx';
import Modal from '../../../ui/Modal.jsx';
import Button from '../../../ui/Button.jsx';

function AddCleListe() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="new-cle">
          <Button>Ajouter un usage</Button>
        </Modal.Open>
        <Modal.Window name="new-cle" title="Ajouter un usage">
          <CreateUpdateCleListeForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddCleListe;
