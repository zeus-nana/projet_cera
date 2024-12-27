import Row from '../../../ui/Row.jsx';
import Heading from '../../../ui/Heading.jsx';
import PermissionTable from './PermissionTable.jsx';
import AddPermission from './AddPermission.jsx';

function Fonctions() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Permissions</Heading>
      </Row>
      <Row>
        <PermissionTable />
        <AddPermission />
      </Row>
    </>
  );
}

export default Fonctions;
