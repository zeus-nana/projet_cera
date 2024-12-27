import React from "react";
import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading.jsx";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDate, formatLargeNumber, formatNumber } from "../../helper.js";
import PropTypes from "prop-types";

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / 3;
  height: 100%;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function CommissionsChart({ data }) {
  const colors = {
    commission: { stroke: "#4f46e5", fill: "#c7d2fe" },
    text: "#374151",
    background: "#fff",
  };

  // Formater les données pour le graphique
  const chartData = data.commission_par_jour.map((item) => ({
    date: item.date,
    commission: parseFloat(item.commission),
    formattedDate: formatDate(item.date),
  }));

  // Calculer la valeur maximale pour l'axe Y
  const maxCommission = Math.max(...chartData.map((item) => item.commission));
  const yAxisMax = Math.ceil(maxCommission / 10000) * 10000;

  // Générer des ticks personnalisés
  const yAxisTicks = [
    0,
    yAxisMax / 4,
    yAxisMax / 2,
    (yAxisMax * 3) / 4,
    yAxisMax,
  ];

  return (
    <StyledSalesChart>
      <Heading as="h2">Commissions</Heading>

      <ResponsiveContainer height="100%" width="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="formattedDate"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
            tickFormatter={(value) => formatLargeNumber(value)}
            domain={[0, yAxisMax]}
            ticks={yAxisTicks}
            width={80}
          />
          <CartesianGrid strokeDasharray="4" />
          <Tooltip
            contentStyle={{ backgroundColor: colors.background }}
            formatter={(value) => formatNumber(value)}
          />
          <Area
            dataKey="commission"
            type="monotone"
            stroke={colors.commission.stroke}
            fill={colors.commission.fill}
            strokeWidth={2}
            name="commission"
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
}

CommissionsChart.propTypes = {
  data: PropTypes.shape({
    commission_par_jour: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        commission: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default CommissionsChart;
/*
*   const colors = {
    totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
    extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
    text: "#374151",
    background: "#fff",
  };
*/
