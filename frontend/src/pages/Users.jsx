import Row from "../ui/Row.jsx";
import Heading from "../ui/Heading.jsx";
import UsersTable from "../features/users/UsersTable.jsx";
import AddUser from "../features/users/AddUser.jsx";

function Users() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Utilisateurs</Heading>
      </Row>
      <Row>
        <UsersTable />
        <AddUser />
      </Row>
    </>
  );
}

export default Users;
