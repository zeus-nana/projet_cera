import ListeToUseTable from './ListeToUseTable.jsx';
import Row from '../../../ui/Row.jsx';
import Heading from '../../../ui/Heading.jsx';
import AddListeToUse from './AddListeToUse.jsx';

function ListeToUse() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Listes statiques</Heading>
      </Row>
      <Row>
        <ListeToUseTable />
        <AddListeToUse />
      </Row>
    </>
  );
}

export default ListeToUse;
