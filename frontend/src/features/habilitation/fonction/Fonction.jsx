import Row from '../../../ui/Row.jsx';
import Heading from '../../../ui/Heading.jsx';
import FonctionsTable from './FonctionsTable.jsx';
import AddFonction from './AddFonction.jsx';

function Fonction() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Fonctions</Heading>
      </Row>
      <Row>
        <FonctionsTable />
        <AddFonction />
      </Row>
    </>
  );
}

export default Fonction;
