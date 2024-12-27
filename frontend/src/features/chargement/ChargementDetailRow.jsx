import PropTypes from "prop-types";
import Table from "../../ui/Table";

function ChargementDetailRow({ detail }) {
  const { ligne, contenu, message_erreur } = detail;

  return (
    <Table.Row>
      <span name="ligne">{ligne}</span>
      <span name="contenu">{contenu}</span>
      <span name="message_erreur">{message_erreur}</span>
    </Table.Row>
  );
}

ChargementDetailRow.propTypes = {
  detail: PropTypes.shape({
    ligne: PropTypes.number.isRequired,
    contenu: PropTypes.string.isRequired,
    message_erreur: PropTypes.string.isRequired,
  }).isRequired,
};

export default ChargementDetailRow;
