import CreateUpdatePermissionForm from './CreateUpdatePermissionForm.jsx';
import Modal from '../../../ui/Modal.jsx';
import Button from '../../../ui/Button.jsx';

function AddPermission() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="new-permission">
          <Button>Ajouter une permission</Button>
        </Modal.Open>
        <Modal.Window name="new-permission" title="Ajouter une permission">
          <CreateUpdatePermissionForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddPermission;
