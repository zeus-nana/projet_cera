import CreateUpdateMenuForm from './CreateUpdateMenuForm.jsx';
import Modal from '../../../ui/Modal.jsx';
import Button from '../../../ui/Button.jsx';

function AddMenu() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="new-menu">
          <Button>Ajouter un menu</Button>
        </Modal.Open>
        <Modal.Window name="new-menu" title="Ajouter un menu">
          <CreateUpdateMenuForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddMenu;
