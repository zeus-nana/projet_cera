// import DateFilter from "../../ui/DateFilter.jsx";
// import Row from "../../ui/Row.jsx";
// import { useEffect, useState } from "react";
// import Button from "../../ui/Button.jsx";
// import PropTypes from "prop-types";
//
// function ReportingFilter({ onFilter }) {
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//
//   useEffect(() => {
//     const today = new Date();
//     const formattedToday = today.toISOString().split("T")[0];
//     setStartDate(formattedToday);
//     setEndDate(formattedToday);
//   }, []);
//
//   const handleFilter = () => {
//     onFilter(startDate, endDate);
//   };
//
//   return (
//     <Row type="horizontal">
//       <DateFilter
//         startDate={startDate}
//         endDate={endDate}
//         onStartDateChange={setStartDate}
//         onEndDateChange={setEndDate}
//       />
//       <Button size="small" onClick={handleFilter}>
//         Afficher
//       </Button>
//     </Row>
//   );
// }
//
// ReportingFilter.propTypes = {
//   onFilter: PropTypes.func.isRequired,
// };
//
// export default ReportingFilter;
import DateFilter from "../../ui/DateFilter.jsx";
import Row from "../../ui/Row.jsx";
import { useState, useEffect } from "react";
import Button from "../../ui/Button.jsx";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

function ReportingFilter({ onFilter, initialDateRange }) {
  const [startDate, setStartDate] = useState(initialDateRange.startDate);
  const [endDate, setEndDate] = useState(initialDateRange.endDate);

  useEffect(() => {
    setStartDate(initialDateRange.startDate);
    setEndDate(initialDateRange.endDate);
  }, [initialDateRange]);

  const handleFilter = () => {
    if (!startDate || !endDate) {
      toast.error("Veuillez sélectionner les deux dates");
      return;
    }
    onFilter(startDate, endDate);
  };

  return (
    <Row type="horizontal">
      <DateFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      <Button size="small" onClick={handleFilter}>
        Afficher
      </Button>
    </Row>
  );
}

ReportingFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
  initialDateRange: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
};

export default ReportingFilter;
