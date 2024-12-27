import styled from "styled-components";
import Stats from "./Stats";
import CommissionsChart from "./CommissionsChart";
import CommissionPartenaireChart from "./CommissionPartenaireChart";
import CommissionsCategorieChart from "./CommissionsCategorieChart";
import TopTenPartenaireTable from "./TopTenPartenaireTable";
import PropTypes from "prop-types";
import TemplateDashboardTable from "./TemplateDashboardTable.jsx";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto repeat(3, 1fr);
  gap: 2rem;
  padding: 2rem;
  max-width: 100%;
`;

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  height: 400px;
  //overflow-y: scroll;
`;

const StatsContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
`;

const ChartContainer = styled.div`
  height: 500px;
  min-height: 400px;
`;

function DashboardLayout({ data }) {
  return (
    <StyledDashboardLayout>
      <StatsContainer>
        <Stats commission_total={data.commission_total} />
      </StatsContainer>
      <ChartContainer>
        <CommissionsChart data={data} />
      </ChartContainer>
      <ChartContainer>
        <CommissionsCategorieChart data={data} />
      </ChartContainer>
      <ChartContainer>
        <CommissionPartenaireChart data={data} />
      </ChartContainer>
      <ChartContainer>
        <ChartContainer>
          <TopTenPartenaireTable data={data.top_10_partenaires} />
        </ChartContainer>
      </ChartContainer>
      <StyledDiv>
        <TemplateDashboardTable
          data={data.top_10_services}
          itemKey="name"
          title="Service"
          showRank={true}
        />
        <TopTenPartenaireTable data={data.top_10_partenaires} />
      </StyledDiv>
      <TopTenPartenaireTable data={data.top_10_partenaires} />
    </StyledDashboardLayout>
  );
}

DashboardLayout.propTypes = {
  data: PropTypes.shape({
    commission_total: PropTypes.shape({
      periode_courante: PropTypes.string.isRequired,
      periode_precedente: PropTypes.string.isRequired,
    }).isRequired,
    commission_par_jour: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        commission: PropTypes.string.isRequired,
      }),
    ).isRequired,
    top_10_partenaires: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        commission: PropTypes.string.isRequired,
      }),
    ).isRequired,
    commissions_par_categorie: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        commission: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default DashboardLayout;

// <TopTenPartenaireTable data={data.top_10_partenaires} />
