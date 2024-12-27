import React from "react";
import PropTypes from "prop-types";
import Table from "../../ui/Table";
import { formatNumber } from "../../helper";

// TemplateDashboardRow component (unchanged)
function TemplateDashboardRow({ item, itemKey, rank }) {
  return (
    <Table.Row>
      {rank !== undefined && (
        <span name="rang" alignment="center">
          {rank}
        </span>
      )}
      <span name={itemKey}>{item[itemKey]}</span>
      <span name="commission" alignment="right">
        {formatNumber(parseFloat(item.commission))}
      </span>
    </Table.Row>
  );
}

TemplateDashboardRow.propTypes = {
  item: PropTypes.shape({
    commission: PropTypes.string.isRequired,
  }).isRequired,
  itemKey: PropTypes.string.isRequired,
  rank: PropTypes.number,
};

// TemplateDashboardTable component
function TemplateDashboardTable({
  data,
  itemKey,
  title,
  showRank = false,
  maxHeight = "400px",
}) {
  const columns = [
    ...(showRank ? [{ name: "rang", width: "20px", filterable: false }] : []),
    { name: itemKey, width: "200px", filterable: false },
    { name: "commission", width: "70px", filterable: false },
  ];

  // Sort data by commission in descending order
  const sortedData = [...data].sort(
    (a, b) => parseFloat(b.commission) - parseFloat(a.commission),
  );

  return (
    <div style={{ maxHeight, overflowY: "auto" }}>
      <Table columns={columns} data={sortedData}>
        <Table.Header>
          {columns.map((column) => (
            <div key={column.name} name={column.name}>
              {column.name === itemKey ? title : column.name}
            </div>
          ))}
        </Table.Header>
        <Table.Body
          render={(item, index) => (
            <TemplateDashboardRow
              key={item[itemKey]}
              item={item}
              itemKey={itemKey}
              rank={showRank ? index + 1 : undefined}
            />
          )}
        />
      </Table>
    </div>
  );
}

TemplateDashboardTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      commission: PropTypes.string.isRequired,
    }),
  ).isRequired,
  itemKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  showRank: PropTypes.bool,
  maxHeight: PropTypes.string,
};

export default TemplateDashboardTable;
