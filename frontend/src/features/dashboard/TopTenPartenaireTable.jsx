import Table from "../../ui/Table";
import PropTypes from "prop-types";
import TopTenPartenaireRow from "./TopTenPartenaireRow";

function TopTenPartenaireTable({ data = [] }) {
  const columns = [
    { name: "rang", width: "50px", filterable: false },
    { name: "name", width: "100px", filterable: false },
    { name: "commission", width: "90px", filterable: false },
  ];

  console.log("data :::", data);

  // Tri des partenaires par commission décroissante
  const sortedData = [...data].sort(
    (a, b) => parseFloat(b.commission) - parseFloat(a.commission),
  );

  return (
    <Table columns={columns} data={sortedData}>
      <Table.Header>
        {columns.map((column) => (
          <div key={column.name} name={column.name}>
            {column.name === "name" ? "Partenaire" : column.name}
          </div>
        ))}
      </Table.Header>
      <Table.Body
        render={(partenaire, index) => (
          <TopTenPartenaireRow
            key={partenaire.name}
            partenaire={partenaire}
            rang={index + 1}
          />
        )}
      />
    </Table>
  );
}

TopTenPartenaireTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      commission: PropTypes.string.isRequired,
    }),
  ),
};

export default TopTenPartenaireTable;
