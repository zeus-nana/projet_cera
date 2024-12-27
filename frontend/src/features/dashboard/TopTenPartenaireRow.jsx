import Table from "../../ui/Table";
import PropTypes from "prop-types";
import { formatNumber } from "../../helper";

function TopTenPartenaireRow({ partenaire, rang }) {
  const { name, commission } = partenaire;

  return (
    <Table.Row>
      <span name="rang" alignment="center">
        {rang}
      </span>
      <span name="name">{name}</span>
      <span name="commission" alignment="right">
        {formatNumber(parseFloat(commission))}
      </span>
    </Table.Row>
  );
}

TopTenPartenaireRow.propTypes = {
  partenaire: PropTypes.shape({
    name: PropTypes.string.isRequired,
    commission: PropTypes.string.isRequired,
  }).isRequired,
  rang: PropTypes.number.isRequired,
};

export default TopTenPartenaireRow;
