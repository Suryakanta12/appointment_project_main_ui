import React, { useState, forwardRef } from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
export default function CustomTableToolbar({
  rows,
  columns,
  selectedIDs,
  handleDelete,
}) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    const tableHeaders = columns
      .map((col) => `<th>${col.headerName}</th>`)
      .join("");
    const tableRows = rows
      .map(
        (row) =>
          `<tr>${columns.map((col) => `<td>${row[col.field] ?? ""}</td>`).join("")}</tr>`,
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print View</title>
          <style>
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <h2>DataGrid Print View</h2>
          <table>
            <thead><tr>${tableHeaders}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <GridToolbarContainer
      sx={{ m: 2, display: "flex", justifyContent: "flex-end" }}
    >
      <GridToolbarQuickFilter />
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport printOptions={{ disableToolbarButton: true }} />

      <Tooltip title="Print">
        <IconButton onClick={handlePrint} color="primary" sx={{ ml: 2 }}>
          <PrintIcon />
        </IconButton>
      </Tooltip>

      {selectedIDs.length > 0 && (
        <Tooltip title="Delete selected">
          <IconButton onClick={handleDelete} color="error" sx={{ ml: 2 }}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </GridToolbarContainer>
  );
}
