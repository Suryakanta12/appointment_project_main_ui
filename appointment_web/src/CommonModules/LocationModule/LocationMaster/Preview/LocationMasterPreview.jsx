import React, { useState, forwardRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import CustomTableToolbar from "../../../../CommonComponents/CustomTableToolbar";

import { deleteRecord } from "services/services";

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));
export default function UserTypePreview(props) {
  const userTypeColumns = [
    {
      field: "actions",
      headerName: "Edit",
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
    { field: "Location_Id", headerName: "ID", minWidth: 100 },
    { field: "Location_Name", headerName: "Location Name", minWidth: 150 },
    {
      field: "Location_City_Name",
      headerName: "Location City Name",
      minWidth: 200,
    },
    {
      field: "Location_Dist_Name",
      headerName: "Location Dist Name",
      minWidth: 150,
    },
    {
      field: "Location_State_Name",
      headerName: "Location State Name",
      minWidth: 100,
    },
    {
      field: "Location_Country_Name",
      headerName: "Location Country Name",
      minWidth: 100,
    },
    {
      field: "Location_Desc",
      headerName: "Location Desc",
      minWidth: 100,
    },
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
    allLocationMaster,
    setAllLocationMaster,
    setPreview,
    setThisLocationMaster,
    setIsEditMode,
    loading,
    setProcessing,
    snackOpen,
    setSnackOpen,
    snackOptions,
    setSnackOptions,
    routeAccess,
  } = props;
  const [selectedIDs, setSelectedIDs] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteIDs, setPendingDeleteIDs] = useState([]);

  const handleSelectionChange = (selectionModel) => {
    setSelectedIDs(selectionModel);
  };
  // console.log("allLocationMaster", allLocationMaster);

  const handleDelete = () => {
    if (selectedIDs.length === 0) return;
    setPendingDeleteIDs(selectedIDs); // store the IDs temporarily
    setDeleteDialogOpen(true); // open dialog
  };

  const handleConfirmDelete = () => {
    setProcessing(true);
    const deletePromises = pendingDeleteIDs.map((id) =>
      deleteRecord(`api/v1/locationmaster/delete-locationmaster/${id}`),
    );

    Promise.all(deletePromises)
      .then((responses) => {
        const failedDeletes = responses.filter(
          (res) => res?.status !== "success",
        );

        if (failedDeletes.length > 0) {
          setSnackOptions({
            color: "error",
            message: `${failedDeletes.length} deletions failed.`,
          });
        } else {
          setSnackOptions({
            color: "success",
            message: "Selected location master deleted successfully.",
          });

          const updatedRows = allLocationMaster.filter(
            (row) => !pendingDeleteIDs.includes(row.Location_Id),
          );
          setAllLocationMaster(updatedRows);
          setSelectedIDs([]);
        }
      })
      .catch((err) => {
        setSnackOptions({
          color: "error",
          message:
            err?.response?.data?.detail || "An error occurred while deleting.",
        });
      })
      .finally(() => {
        setProcessing(false);
        setSnackOpen(true);
        setDeleteDialogOpen(false);
        setPendingDeleteIDs([]);
      });
  };

  const handleEditClick = (row) => {
    setThisLocationMaster(row); // Set the selected user type
    setIsEditMode(true); // Enable edit mode
    setPreview(false); // Go back to the form (if applicable)
  };

  return (
    <React.Fragment>
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
            rows={allLocationMaster}
            columns={userTypeColumns}
            checkboxSelection
            disableRowSelectionOnClick
            pagination
            pageSizeOptions={[5, 10, 25]}
            getRowId={(row) => row.Location_Id}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={selectedIDs}
            slots={{
              toolbar: () => (
                <CustomTableToolbar
                  rows={allLocationMaster}
                  columns={userTypeColumns}
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
      <Dialog
        open={deleteDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setDeleteDialogOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete {pendingDeleteIDs.length} record(s)?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
