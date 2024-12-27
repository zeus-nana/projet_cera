import Modal from '../../../ui/Modal.jsx';
import Button from '../../../ui/Button.jsx';
import CreateUpdateListeToUseForm from './CreateUpdateListeToUseForm.jsx';

function AddListeToUse() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="new-liste">
          <Button>Ajouter une liste</Button>
        </Modal.Open>
        <Modal.Window name="new-liste" title="Ajouter une liste">
          <CreateUpdateListeToUseForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddListeToUse;
