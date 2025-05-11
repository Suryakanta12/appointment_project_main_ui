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
    { field: "User_Permission_Id", headerName: "ID", minWidth: 150 },
    { field: "User_Type_Id", headerName: "User Type Id", minWidth: 100 },
    { field: "Page_Id", headerName: "Page Id", minWidth: 150 },
    { field: "Can_View", headerName: "Can View", minWidth: 200 },
    { field: "Can_Create", headerName: "Can Create", minWidth: 150 },
    { field: "Can_Update", headerName: "Can Update", minWidth: 100 },
    { field: "Can_Delete", headerName: "Can Delete", minWidth: 100 },
    { field: "Added_By", headerName: "Added By", minWidth: 150 },
    { field: "Added_On", headerName: "Added On", minWidth: 150 },
    { field: "Modified_By", headerName: "Modified By", minWidth: 150 },
    { field: "Modified_On", headerName: "Modified On", minWidth: 150 },
    { field: "Deleted_By", headerName: "Deleted By", minWidth: 150 },
    { field: "Deleted_On", headerName: "Deleted On", minWidth: 150 },
    { field: "Is_Deleted", headerName: "Deleted", minWidth: 100 },
  ];
  const {
    allUserPermission,
    setAllUserPermission,
    setPreview,
    setThisUserPermission,
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
  // console.log("allUserPermission", allUserPermission);

  const handleDelete = () => {
    if (selectedIDs.length === 0) return;
    setPendingDeleteIDs(selectedIDs); // store the IDs temporarily
    setDeleteDialogOpen(true); // open dialog
  };

  const handleConfirmDelete = () => {
    setProcessing(true);
    const deletePromises = pendingDeleteIDs.map((id) =>
      deleteRecord(`api/v1/userpermissions/delete-userpermission/${id}`),
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
            message: "Selected user types deleted successfully.",
          });

          const updatedRows = allUserPermission.filter(
            (row) => !pendingDeleteIDs.includes(row.User_Permission_Id),
          );
          setAllUserPermission(updatedRows);
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
    setThisUserPermission(row); // Set the selected user type
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
            rows={allUserPermission}
            columns={userTypeColumns}
            checkboxSelection
            disableRowSelectionOnClick
            pagination
            pageSizeOptions={[5, 10, 25]}
            getRowId={(row) => row.User_Permission_Id}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={selectedIDs}
            slots={{
              toolbar: () => (
                <CustomTableToolbar
                  rows={allUserPermission}
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
