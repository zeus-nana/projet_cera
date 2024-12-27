import EtatsTable from './EtatsTable.jsx';
import AddEtat from './AddEtat.jsx';
import Row from '../../../ui/Row.jsx';
import Heading from '../../../ui/Heading.jsx';

function Etat() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">États</Heading>
      </Row>
      <Row>
        <EtatsTable />
        <AddEtat />
      </Row>
    </>
  );
}

export default Etat;
