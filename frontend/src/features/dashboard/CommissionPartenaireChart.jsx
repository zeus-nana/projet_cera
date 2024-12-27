import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";
import { formatLargeNumber, formatNumber } from "../../helper";

const StyledCommissionPartenaire = styled(DashboardBox)`
  grid-column: 1 / 3;
  height: 100%;

  .recharts-cartesian-grid-horizontal line,
  .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

const CommissionPartenaireChart = ({ data }) => {
  const colors = {
    bar: "#0369a1",
    text: "#374151",
    background: "#fff",
  };

  const sortedData = [...data.top_10_partenaires].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const maxCommission = Math.max(
    ...sortedData.map((item) => Number(item.commission)),
  );
  const yAxisMax = Math.ceil(maxCommission / 100000) * 100000;
  const yAxisTicks = [
    0,
    yAxisMax / 4,
    yAxisMax / 2,
    (yAxisMax * 3) / 4,
    yAxisMax,
  ];

  // Fonction pour tronquer les labels longs
  const truncateLabel = (label, maxLength = 10) => {
    return label.length > maxLength
      ? `${label.substring(0, maxLength)}...`
      : label;
  };

  // Composant personnalisé pour les labels de l'axe X
  const CustomXAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill={colors.text}
          transform="rotate(-45)"
        >
          {truncateLabel(payload.value)}
        </text>
      </g>
    );
  };

  return (
    <StyledCommissionPartenaire>
      <Heading as="h2">Commission par Partenaire</Heading>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={sortedData}
          margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            interval={0}
            tick={<CustomXAxisTick />}
            height={100}
          />
          <YAxis
            tick={{ fill: colors.text }}
            tickFormatter={(value) => formatLargeNumber(value)}
            domain={[0, yAxisMax]}
            ticks={yAxisTicks}
            width={80}
          />
          <Tooltip
            formatter={(value) => formatNumber(value)}
            contentStyle={{ backgroundColor: colors.background }}
            labelFormatter={(label) => `Partenaire: ${label}`}
          />
          <Bar dataKey="commission" fill={colors.bar} />
        </BarChart>
      </ResponsiveContainer>
    </StyledCommissionPartenaire>
  );
};

export default CommissionPartenaireChart;
