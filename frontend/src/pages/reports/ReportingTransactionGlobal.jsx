import Heading from "../../ui/Heading.jsx";
import Row from "../../ui/Row.jsx";
import ReportingFilter from "../../features/reporting/reportingFilter.jsx";
import TransactionGlobalTable from "../../features/reporting/TransactionGlobalTable.jsx";
import ReportingService from "../../services/reportingService";
import { useReporting } from "../../features/reporting/useReporting.js";

function ReportingTransactionGlobal() {
  const { data, isLoading, error, dateRange, handleFilter } = useReporting(
    "transactionsGlobales",
    ReportingService.getTransactionsByDate,
    "transactionsGlobales",
  );

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Transactions Globales</Heading>
        <ReportingFilter onFilter={handleFilter} initialDateRange={dateRange} />
      </Row>
      <Row>
        <TransactionGlobalTable
          data={data}
          isLoading={isLoading}
          error={error}
        />
      </Row>
    </>
  );
}

export default ReportingTransactionGlobal;
