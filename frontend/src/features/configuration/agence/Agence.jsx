import AgencesTable from './AgencesTable.jsx';
import AddAgence from './AddAgence.jsx';
import Row from '../../../ui/Row.jsx';
import Heading from '../../../ui/Heading.jsx';

function Agence() {
    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">Agences</Heading>
            </Row>
            <Row>
                <AgencesTable />
                <AddAgence />
            </Row>
        </>
    );
}

export default Agence;
