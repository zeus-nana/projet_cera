import Modal from '../../../ui/Modal.jsx';
import Button from '../../../ui/Button.jsx';
import AttributionFonctionForm from './AttributionFonctionForm.jsx';

function Add() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="user-fonction">
          <Button>Ajouter</Button>
        </Modal.Open>
        <Modal.Window name="user-fonction" title="Atribuer une fonction">
          <AttributionFonctionForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default Add;
