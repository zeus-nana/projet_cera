// import Heading from "../../ui/Heading.jsx";
// import Row from "../../ui/Row.jsx";
// import ReportingFilter from "../../features/reporting/reportingFilter.jsx";
// import TransactionAgregeTable from "../../features/reporting/TransactionAgregeTable.jsx";
// import { useState } from "react";
//
// function ReportingTransactionAgrege() {
//   const [dateRange, setDateRange] = useState({
//     startDate: null,
//     endDate: null,
//   });
//
//   const handleFilter = (startDate, endDate) => {
//     setDateRange({ startDate, endDate });
//   };
//
//   return (
//     <>
//       <Row type="horizontal">
//         <Heading type="h1">Transactions Agrégées</Heading>
//         <ReportingFilter onFilter={handleFilter} />
//       </Row>
//       <Row>
//         <TransactionAgregeTable dateRange={dateRange} />
//       </Row>
//     </>
//   );
// }
//
// export default ReportingTransactionAgrege;

import Heading from "../../ui/Heading.jsx";
import Row from "../../ui/Row.jsx";
import ReportingFilter from "../../features/reporting/reportingFilter.jsx";
import TransactionAgregeTable from "../../features/reporting/TransactionAgregeTable.jsx";
import ReportingService from "../../services/reportingService";
import { useReporting } from "../../features/reporting/useReporting.js";

function ReportingTransactionAgrege() {
  const { data, isLoading, error, dateRange, handleFilter } = useReporting(
    "transactionsAgregees",
    ReportingService.getTransactionsAgregeByDate,
    "transactionsAgregees",
  );

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Transactions Agrégées</Heading>
        <ReportingFilter onFilter={handleFilter} initialDateRange={dateRange} />
      </Row>
      <Row>
        <TransactionAgregeTable
          data={data}
          isLoading={isLoading}
          error={error}
        />
      </Row>
    </>
  );
}

export default ReportingTransactionAgrege;
