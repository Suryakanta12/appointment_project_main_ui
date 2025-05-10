import * as React from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

import { deleteRecord, handleResponse } from "services/services";

function CustomToolbar({ rows, columns, selectedIDs, handleDelete }) {
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

export default function UserTypePreview(props) {
  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip title="Edit">
          <IconButton
            color="primary"
            onClick={() => handleEditClick(params.row)}
          >
            <EditNoteOutlinedIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    { field: "User_Type_Id", headerName: "ID", minWidth: 100 },
    { field: "User_Type_Name", headerName: "Name", minWidth: 150 },
    { field: "User_Type_Desc", headerName: "Email", minWidth: 200 },
    { field: "Default_Page", headerName: "Default Page", minWidth: 150 },
    { field: "Is_Member", headerName: "Member", minWidth: 100 },
    { field: "Is_Active", headerName: "Active", minWidth: 100 },
    { field: "Added_By", headerName: "Added By", minWidth: 150 },
    { field: "Added_On", headerName: "Added On", minWidth: 150 },
    { field: "Modified_By", headerName: "Modified By", minWidth: 150 },
    { field: "Modified_On", headerName: "Modified On", minWidth: 150 },
    { field: "Deleted_By", headerName: "Deleted By", minWidth: 150 },
    { field: "Deleted_On", headerName: "Deleted On", minWidth: 150 },
    { field: "Is_Deleted", headerName: "Deleted", minWidth: 100 },
  ];
  const {
    allUserTypes,
    setAllUserTypes,
    setPreview,
    setThisUserTypes,
    setIsEditMode,
    loading,
    routeAccess,
  } = props;
  const [selectedIDs, setSelectedIDs] = React.useState([]);

  const handleSelectionChange = (selectionModel) => {
    setSelectedIDs(selectionModel);
  };
  // console.log("allUserTypes", allUserTypes);

  const handleDelete = async () => {
    if (selectedIDs.length === 0) return;

    try {
      // Optional: confirmation prompt
      const confirmDelete = window.confirm(
        `Are you sure you want to delete ${selectedIDs.length} record(s)?`,
      );
      if (!confirmDelete) return;

      // Call delete API for each ID
      const deletePromises = selectedIDs.map((id) =>
        deleteRecord(`api/v1/usertypes/delete-usertypes/${id}`),
      );

      const responses = await Promise.all(deletePromises);
      console.log("responses---", deletePromises);

      // Handle API responses
      const failedDeletes = responses.filter(
        (res) => handleResponse(res)?.status !== "success",
      );

      if (failedDeletes.length > 0) {
        alert(`${failedDeletes.length} deletions failed.`);
      } else {
        alert("Selected user types deleted successfully.");
      }

      // Update state by filtering deleted IDs
      const updatedRows = allUserTypes.filter(
        (row) => !selectedIDs.includes(row.User_Type_Id),
      );
      setAllUserTypes(updatedRows);
      setSelectedIDs([]);
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting records.");
    }
    // const updatedRows = allUserTypes.filter(
    //   (row) => !selectedIDs.includes(row.User_Type_Id),
    // );
    // setAllUserTypes(updatedRows);
    // setSelectedIDs([]);
  };

  const handleEditClick = (row) => {
    setThisUserTypes(row); // Set the selected user type
    setIsEditMode(true); // Enable edit mode
    setPreview(false); // Go back to the form (if applicable)
  };

  return (
    <Paper
      sx={{
        height: 600,
        width: "100%",
        overflowX: "auto",
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={allUserTypes}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          pagination
          pageSizeOptions={[5, 10, 25]}
          getRowId={(row) => row.User_Type_Id}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          onRowSelectionModelChange={handleSelectionChange}
          rowSelectionModel={selectedIDs}
          slots={{
            toolbar: () => (
              <CustomToolbar
                rows={allUserTypes}
                columns={columns}
                selectedIDs={selectedIDs}
                handleDelete={handleDelete}
              />
            ),
          }}
          sx={{
            borderRadius: 2,
            boxShadow: 2,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          }}
        />
      )}
    </Paper>
  );
}
