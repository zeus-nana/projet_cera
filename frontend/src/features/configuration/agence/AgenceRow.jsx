/* eslint-disable react/no-unknown-property */
import PropTypes from 'prop-types';
import { HiPencil } from 'react-icons/hi';
import Modal from '../../../ui/Modal.jsx';
import Table from '../../../ui/Table.jsx';
import Menus from '../../../ui/Menus.jsx';
import CreateUpdateAgenceForm from './CreateUpdateAgenceForm.jsx';

function AgenceRow({ agence }) {
    const {
        id,
        code_agence,
        agence: agenceNom,
        gesuni,
        reseau,
        pole,
        type_agence,
        v_hv,
        telephone,
        commune,
        arrondissement,
        departement,
        region,
    } = agence;

    return (
        <Table.Row>
            <span name="code_agence">{code_agence}</span>
            <span name="agence">{agenceNom}</span>
            <span name="gesuni">{gesuni}</span>
            <span name="reseau">{reseau}</span>
            <span name="pole">{pole}</span>
            <span name="type_agence">{type_agence.toUpperCase()}</span>
            <span name="v/hv">{v_hv}</span>
            <span name="telephone">{telephone}</span>
            <span name="commune">{commune}</span>
            <span name="arrondissement">{arrondissement.toUpperCase()}</span>
            <span name="departement">{departement.toUpperCase()}</span>
            <span name="region">{region.toUpperCase()}</span>
            <span name="actions" alignment="center">
                <Modal>
                    <Menus.Menu>
                        <Menus.Toggle id={id.toString()} />
                        <Menus.List id={id.toString()}>
                            <Modal.Open opens="edit">
                                <Menus.Button icon={<HiPencil />}>Éditer</Menus.Button>
                            </Modal.Open>
                        </Menus.List>

                        <Modal.Window name="edit" title="Editer une agence">
                            <CreateUpdateAgenceForm agenceToEdit={agence} />
                        </Modal.Window>
                    </Menus.Menu>
                </Modal>
            </span>
        </Table.Row>
    );
}

AgenceRow.propTypes = {
    agence: PropTypes.shape({
        id: PropTypes.number.isRequired,
        code_agence: PropTypes.string.isRequired,
        agence: PropTypes.string.isRequired,
        gesuni: PropTypes.string.isRequired,
        reseau: PropTypes.string.isRequired,
        pole: PropTypes.string.isRequired,
        type_agence: PropTypes.string.isRequired,
        v_hv: PropTypes.string.isRequired,
        telephone: PropTypes.string,
        commune: PropTypes.string.isRequired,
        arrondissement: PropTypes.string.isRequired,
        departement: PropTypes.string.isRequired,
        region: PropTypes.string.isRequired,
    }).isRequired,
};

export default AgenceRow;
