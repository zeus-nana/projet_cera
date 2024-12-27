import CreateUpdateEtatForm from './CreateUpdateEtatForm.jsx';
import Modal from '../../../ui/Modal.jsx';
import Button from '../../../ui/Button.jsx';

function AddEtat() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="new-etat">
          <Button>Ajouter un état</Button>
        </Modal.Open>
        <Modal.Window name="new-etat" title="Ajouter un état">
          <CreateUpdateEtatForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddEtat;
