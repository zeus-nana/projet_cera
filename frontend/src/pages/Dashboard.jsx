import Row from "../ui/Row.jsx";
import Heading from "../ui/Heading.jsx";
import DashboardLayout from "../features/dashboard/DashboardLayout.jsx";
import ReportingFilter from "../features/reporting/reportingFilter.jsx";

import { useDashboardData } from "../features/dashboard/useDashboardData.js";
import Spinner from "../ui/Spinner.jsx";

function Dashboard() {
  const { data, isLoading, dateRange, handleFilter } = useDashboardData();

  if (isLoading) return <Spinner />;

  const dashboardData = data?.data?.data;

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Tableau de bord</Heading>
        <ReportingFilter onFilter={handleFilter} initialDateRange={dateRange} />
      </Row>
      <DashboardLayout data={dashboardData} />
    </>
  );
}

export default Dashboard;
