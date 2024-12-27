import Row from '../../../ui/Row.jsx';
import Heading from '../../../ui/Heading.jsx';
import MenuTable from './MenuTable.jsx';
import AddMenu from './AddMenu.jsx';

function Menu() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Menus</Heading>
      </Row>
      <Row>
        <MenuTable />
        <AddMenu />
      </Row>
    </>
  );
}

export default Menu;
