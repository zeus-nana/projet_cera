import PropTypes from "prop-types";

function Empty({ resource }) {
  return <p>No {resource} could be found.</p>;
}

Empty.prototypes.propTypes = {
  resource: PropTypes.string.isRequired,
};

export default Empty;
