import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Label,
} from "recharts";
import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";
import { formatNumber, formatLargeNumber } from "../../helper";

const StyledCommissionsCategorieChart = styled(DashboardBox)`
  grid-column: 1 / -1;
  height: 100%;
`;

const ChartInfo = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const TotalCommission = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const SelectedCategory = styled.div`
  font-size: 1rem;
  color: #666;
`;

const COLORS = ["#0369a1", "#15803d", "#a16207", "#FF8042", "#b91c1c"];

const colors = {
  text: "#374151",
  background: "#fff",
};

function CommissionsCategorieChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const chartData = data.commissions_par_categorie.map((item) => ({
    name: item.name,
    value: parseFloat(item.commission),
  }));

  const totalCommission = chartData.reduce((sum, item) => sum + item.value, 0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <StyledCommissionsCategorieChart>
      <Heading as="h2">Commissions par Catégorie</Heading>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={120}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke={activeIndex === index ? "#f3f4f6" : "none"}
                strokeWidth={activeIndex === index ? 2 : 0}
              />
            ))}
            <Label
              content={({ viewBox: { cx, cy } }) => (
                <ChartInfo style={{ x: cx, y: cy }}>
                  <TotalCommission>
                    {formatLargeNumber(totalCommission)}
                  </TotalCommission>
                  <SelectedCategory>
                    {activeIndex !== null
                      ? chartData[activeIndex].name
                      : "Total"}
                  </SelectedCategory>
                </ChartInfo>
              )}
              position="center"
            />
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: colors.background }}
            itemStyle={{ color: "#0369a1" }}
            formatter={(value) => formatNumber(value)}
          />
          <Legend layout="vertical" align="center" verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </StyledCommissionsCategorieChart>
  );
}

export default CommissionsCategorieChart;
