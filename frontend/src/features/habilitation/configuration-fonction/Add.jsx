import ConfigFonctionForm from './ConfigFonctionForm.jsx';
import Modal from '../../../ui/Modal.jsx';
import Button from '../../../ui/Button.jsx';

function Add() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="new-configFonction">
          <Button>Ajouter</Button>
        </Modal.Open>
        <Modal.Window name="new-configFonction" title="Ajouter des permissions aux fonctions">
          <ConfigFonctionForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default Add;
