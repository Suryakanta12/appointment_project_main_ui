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
    const UserColumns = [
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
      { field: "User_Id", headerName: "ID", minWidth: 100 },
      { field: "Full_Name", headerName: "Full Name", minWidth: 150 },
      { field: "Email", headerName: "Email", minWidth: 200 },
      { field: "Phone", headerName: "Phone", minWidth: 150 },
      { field: "Alt_Phone", headerName: "Alt Phone", minWidth: 150 },
      { field: "Password_Hash", headerName: "Password Hash", minWidth: 200 },
      { field: "Forgot_Token", headerName: "Forgot Token", minWidth: 200 },
      {
        field: "Forgot_Token_Expiry",
        headerName: "Token Expiry",
        minWidth: 180,
      },
      { field: "User_Type_Id", headerName: "User Type ID", minWidth: 130 },
      { field: "Profile_Image", headerName: "Profile Image", minWidth: 200 },
      {
        field: "Background_Image",
        headerName: "Background Image",
        minWidth: 200,
      },
      { field: "Bio", headerName: "Bio", minWidth: 250 },
      { field: "Website", headerName: "Website", minWidth: 200 },
      { field: "Social_Links", headerName: "Social Links", minWidth: 250 },
      { field: "Gender", headerName: "Gender", minWidth: 100 },
      { field: "DOB", headerName: "DOB", minWidth: 150 },
      { field: "Occupation", headerName: "Occupation", minWidth: 150 },
      { field: "Company_Name", headerName: "Company", minWidth: 150 },
      { field: "GST_Number", headerName: "GST Number", minWidth: 150 },
      { field: "Referral_Code", headerName: "Referral Code", minWidth: 150 },
      { field: "Address", headerName: "Address", minWidth: 200 },
      { field: "City", headerName: "City", minWidth: 120 },
      { field: "State", headerName: "State", minWidth: 120 },
      { field: "Country", headerName: "Country", minWidth: 120 },
      { field: "Postal_Code", headerName: "Postal Code", minWidth: 130 },
      { field: "Preferred_Language", headerName: "Language", minWidth: 130 },
      { field: "Is_Verified", headerName: "Verified", minWidth: 100 },
      { field: "Is_Active", headerName: "Active", minWidth: 100 },
      { field: "Is_Deleted", headerName: "Deleted", minWidth: 100 },
      { field: "Wallet_Balance", headerName: "Wallet", minWidth: 130 },
      { field: "Currency", headerName: "Currency", minWidth: 100 },
      {
        field: "Last_Transaction_Id",
        headerName: "Last Txn ID",
        minWidth: 200,
      },
      { field: "Payment_Mode", headerName: "Payment Mode", minWidth: 150 },
      {
        field: "Is_Wallet_Enabled",
        headerName: "Wallet Enabled",
        minWidth: 150,
      },
      { field: "Added_By", headerName: "Added By", minWidth: 120 },
      { field: "Added_On", headerName: "Added On", minWidth: 150 },
      { field: "Modified_By", headerName: "Modified By", minWidth: 120 },
      { field: "Modified_On", headerName: "Modified On", minWidth: 150 },
      { field: "Deleted_By", headerName: "Deleted By", minWidth: 120 },
      { field: "Deleted_On", headerName: "Deleted On", minWidth: 150 },
    ];
      
  const {
    allUsers,
    setAllUsers,
    setPreview,
    setThisUsers,
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
  // console.log("allUsers", allUsers);

  const handleDelete = () => {
    if (selectedIDs.length === 0) return;
    setPendingDeleteIDs(selectedIDs); // store the IDs temporarily
    setDeleteDialogOpen(true); // open dialog
  };

  const handleConfirmDelete = () => {
    setProcessing(true);
    const deletePromises = pendingDeleteIDs.map((id) =>
      deleteRecord(`api/v1/users/delete-users/${id}`),
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

          const updatedRows = allUsers.filter(
            (row) => !pendingDeleteIDs.includes(row.User_Id),
          );
          setAllUsers(updatedRows);
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
    setThisUsers(row); // Set the selected user type
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
            rows={allUsers}
            columns={UserColumns}
            checkboxSelection
            disableRowSelectionOnClick
            pagination
            pageSizeOptions={[5, 10, 25]}
            getRowId={(row) => row.User_Id}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={selectedIDs}
            slots={{
              toolbar: () => (
                <CustomTableToolbar
                  rows={allUsers}
                  columns={UserColumns}
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
