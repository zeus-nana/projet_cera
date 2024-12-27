import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "./Button.jsx";

const StyledExportButton = styled(Button)`
  //width: auto;
  //margin-top: 1rem;
`;

function ExportButton({ data, columns, filename }) {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((row) =>
        columns.reduce((acc, col) => {
          acc[col.name] = row[col.name];
          return acc;
        }, {}),
      ),
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
    XLSX.writeFile(workbook, `${filename}_${timestamp}.xlsx`);
  };

  return (
    <StyledExportButton
      onClick={exportToExcel}
      size="medium"
      $variation="excel"
    >
      Exporter vers Excel
    </StyledExportButton>
  );
}

ExportButton.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  filename: PropTypes.string.isRequired,
};

export default ExportButton;
