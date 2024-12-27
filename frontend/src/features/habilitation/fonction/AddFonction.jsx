import CreateUpdateFonctionForm from './CreateUpdateFonctionForm.jsx';
import Modal from '../../../ui/Modal.jsx';
import Button from '../../../ui/Button.jsx';

function AddFonction() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="new-fonction">
          <Button>Ajouter une fonction</Button>
        </Modal.Open>
        <Modal.Window name="new-fonction" title="Ajouter une fonction">
          <CreateUpdateFonctionForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddFonction;
