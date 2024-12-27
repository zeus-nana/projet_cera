import ChargementTable from "../features/chargement/ChargementTable.jsx";
import Row from "../ui/Row.jsx";
import ReportingFilter from "../features/reporting/reportingFilter.jsx";
import Heading from "../ui/Heading.jsx";
import ReportingService from "../services/reportingService.js";
import { useReporting } from "../features/reporting/useReporting.js";
import UploadFile from "../features/chargement/UploadFile.jsx";

function Chargement() {
  const { data, isLoading, error, dateRange, handleFilter } = useReporting(
    "chargements",
    ReportingService.getChargementByDate,
    "chargements",
  );

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Chargements</Heading>
        <ReportingFilter onFilter={handleFilter} initialDateRange={dateRange} />
      </Row>
      <Row>
        <ChargementTable data={data} isLoading={isLoading} error={error} />
        <UploadFile />
      </Row>
    </>
  );
}

export default Chargement;
