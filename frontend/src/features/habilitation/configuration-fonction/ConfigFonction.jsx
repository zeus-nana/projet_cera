import Row from '../../../ui/Row.jsx';
import Heading from '../../../ui/Heading.jsx';
import ConfigFonctionTable from './ConfigFonctionTable.jsx';
import Add from './Add.jsx';

function ConfigFonctions() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Configuration des fonctions</Heading>
      </Row>
      <Row>
        <ConfigFonctionTable />
        <Add />
      </Row>
    </>
  );
}

export default ConfigFonctions;
