import CleListeTable from './CleListeTable.jsx';
import AddCleListe from './AddCleListe.jsx';
import Row from '../../../ui/Row.jsx';
import Heading from '../../../ui/Heading.jsx';

function CleListe() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Usages</Heading>
      </Row>
      <Row>
        <CleListeTable />
        <AddCleListe />
      </Row>
    </>
  );
}

export default CleListe;
