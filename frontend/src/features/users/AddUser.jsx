import Modal from '../../ui/Modal.jsx';
import CreateUserForm from './CreateUserForm.jsx';
import Button from '../../ui/Button.jsx';

function AddUser() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="newUser-form">
          <Button>Ajouter un utilisateur</Button>
        </Modal.Open>
        <Modal.Window name="newUser-form" title="Ajouter un utilisateur">
          <CreateUserForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddUser;
