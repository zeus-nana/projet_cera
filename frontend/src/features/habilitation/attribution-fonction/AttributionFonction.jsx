import Row from '../../../ui/Row.jsx';
import Heading from '../../../ui/Heading.jsx';
import Add from './Add.jsx';
import AttributionFonctionTable from './AttributionFonctionTable.jsx';

function AttributionFonction() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Attribution des fonctions</Heading>
      </Row>
      <Row>
        <AttributionFonctionTable />
        <Add />
      </Row>
    </>
  );
}

export default AttributionFonction;
