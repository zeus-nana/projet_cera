import CreateUpdateAgenceForm from './CreateUpdateAgenceForm.jsx';
import Modal from '../../../ui/Modal.jsx';
import Button from '../../../ui/Button.jsx';

function AddAgence() {
    return (
        <div>
            <Modal>
                <Modal.Open opens="new-agence">
                    <Button>Ajouter une agence</Button>
                </Modal.Open>
                <Modal.Window name="new-agence" title="Ajouter une agence">
                    <CreateUpdateAgenceForm />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default AddAgence;
