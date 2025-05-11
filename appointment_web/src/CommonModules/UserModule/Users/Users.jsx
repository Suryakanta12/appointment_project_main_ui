/**
 * * Project Name : Appointment
 * * Layer Name : Database
 * * Section : Users
 * * Parent : Admin
 * Description : design Users primary admin with Database
 * Author: Suryakanta sahu
 * Date Created: 10-May-2025
 *
 *
 *
 *
 *
 */
/** ------------------ Primary Import Declaration -------- */
import React, { useEffect, useState, useContext } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
/* ---------------------- MUI Components & APIs ----------------*/
import {
  Container,
  Grid,
  Box,
  Stack,
  Breadcrumbs,
  Link,
  Typography,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
/** ------------------ User Components ------------------- */
import UsersForm from "./Form/UsersForm.jsx";
import UsersPreview from "./Preview/UsersPreview.jsx";
import Snackbar from "SnackBar/Snackbar.jsx";
import {
  postRecord,
  handleResponse,
  getRecord,
  putRecord,
} from "services/services";
import { AuthContext } from "../../../ContextOrRedux/AuthContext";
import { CheckRouteAccess } from "commonmethods/Authorization";
/** ------------------ Icons ----------------------------- */
import ListIcon from "@mui/icons-material/List";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AdminHeader from "../../../Template/Dashboards/Components/AdminHeader/AdminHeader.jsx";
/** ------------------ Media Imports --------------------- */
/** ------------------ Style Components ------------------ */
/** ------------------ API Declarations ------------------ */
const API_GetAllUsers = "api/v1/users/all-users";
const API_AddUser = "api/v1/users/add-users";
const API_UpdateUser = "api/v1/users/update-users/{user_id}";
const API_GetAllUserTypes = "api/v1/usertypes/all-usertypes";

/** ------------------ Third Party Components ------------ */

export default function Users(props) {
  const navigate = useNavigate();
  /** ------------------ Initial States -------------------- */
  const context = useContext(AuthContext);
  const initialUserState = {
    User_Id: null,
    Full_Name: "",
    Email: "",
    Phone: "",
    Alt_Phone: "",
    Password_Hash: "",
    User_Type_Id: null,
    Profile_Image: "",
    Background_Image: "",
    Bio: "",
    Website: "",
    Social_Links: "",
    Gender: "",
    DOB: "",
    Occupation: "",
    Company_Name: "",
    GST_Number: "",
    Referral_Code: "",
    Address: "",
    City: "",
    State: "",
    Country: "India",
    Postal_Code: "",
    Preferred_Language: "",
    Is_Verified: 0,
    Is_Active: "N",
    Is_Deleted: "N",
    Wallet_Balance: 0,
    Currency: "",
    Last_Transaction_Id: "",
    Payment_Mode: "",
    Is_Wallet_Enabled: 0,
    Added_By: context.state.user.User_Id,
    Added_On: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  };

  /** ------------------ useStates ------------------------- */
  const [routeAccess, setRouteAccess] = useState(
    CheckRouteAccess(window.location.pathname),
  );
  const [allUsers, setAllUsers] = useState([]);
  const [allUserTypes, setAllUserTypes] = useState([]);
  const [thisUsers, setThisUsers] = useState(initialUserState);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackOptions, setSnackOptions] = useState({
    color: "success",
    message: "Hi",
  });
  /** ------------------ useEffects ------------------------ */
  useEffect(() => {
    let componentMounted = true;
    getRecord(API_GetAllUsers, {}).then((response) => {
      if (response.status === "success" && componentMounted && preview) {
        setAllUsers(response.data.data);
        setLoading(false);
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [preview]);
  useEffect(() => {
    let componentMounted = true;
    getRecord(API_GetAllUserTypes, {})
      .then((response) => {
        if (response.status === "success") {
          var typeData = response.data.filter((item) => {
            return item.User_Type_Id !== 1 && item.Is_Active === "Y";
          });
          setAllUserTypes(typeData);
        }
      })
      .catch((err) => {
        setSnackOptions({
          color: "error",
          message: err.response.data.detail,
        });
        setSnackOpen(true);
      });
    //   .then((response) => {
    //   if (response.status === "success" && componentMounted && !preview) {
    //     setAllUserTypes(response.data);
    //   }
    // });
    return () => {
      componentMounted = false;
    };
  }, [preview]);
  /** ------------------ Functions & Events ---------------- */
  const addUser = () => {
    postRecord(API_AddUser, thisUsers)
      .then((response) => {
        if (response.status === "success") {
          setSnackOptions({ color: response.color, message: response.message });
          resetAndPreview();
        } else {
          setSnackOptions({ color: response.color, message: response.message });
        }
        setProcessing(false);
        setSnackOpen(true);
      })
      .catch((err) => {
        setSnackOptions({
          color: "error",
          message: err.response.data.detail,
        });
        setSnackOpen(true);
        setProcessing(false);
      });
  };

  const updateUser = () => {
    const userId = thisUsers.User_Id;
    if (!userId) {
      setSnackOptions({
        color: "error",
        message: "Invalid User ID",
      });
      setSnackOpen(true);
      return;
    }

    thisUsers.Modified_By = context.state.user.User_Id;
    thisUsers.Modified_On = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    const endpoint = `api/v1/users/update-user/${userId}`;

    putRecord(endpoint, thisUsers)
      .then((response) => {
        setSnackOptions({
          color: response.data.color,
          message: response.data.message,
        });
        setSnackOpen(true);
        setProcessing(false);
        resetAndPreview();
      })
      .catch((err) => {
        setSnackOptions({
          color: "error",
          message: err.response.data.detail,
        });
        setSnackOpen(true);
        setProcessing(false);
      });
  };

  const resetAndPreview = () => {
    setThisUsers(initialUserState);
    setIsEditMode(false);
    setPreview(true);
    // setProcessing(false);
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex" }}>
        <AdminHeader />
        <Container
          sx={{ my: 10, minWidth: "76vw !important", minHeight: "70vh" }}
        >
          <Box align="left">
            <Typography variant="h6"> Users</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box role="presentation">
                <Stack spacing={2}>
                  <Breadcrumbs aria-label="breadcrumb">
                    <Button
                      type="link"
                      underline="hover"
                      color="inherit"
                      onClick={() =>
                        navigate(context.state.usertype.Default_Page)
                      }
                    >
                      Home
                    </Button>
                    <Button
                      type="link"
                      underline="hover"
                      color="inherit"
                      onClick={resetAndPreview}
                    >
                      User
                    </Button>
                    <Typography sx={{ color: "text.primary" }}>
                      {preview ? (
                        "User List"
                      ) : (
                        <>{isEditMode ? "Edit User" : "Add New User"}</>
                      )}
                    </Typography>
                  </Breadcrumbs>
                </Stack>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Tooltip title="Go to List" placement="top">
                  <IconButton
                    color="primary"
                    onClick={resetAndPreview}
                    sx={{ mr: 1 }}
                  >
                    <ListIcon />
                  </IconButton>
                </Tooltip>
                {!isEditMode && (
                  <Tooltip title="Add new  User" placement="top">
                    <span>
                      <IconButton
                        color="primary"
                        onClick={() => setPreview(false)}
                        disabled={routeAccess.Can_Create === "Y"}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Box>
          {preview ? (
            <UsersPreview
              setPreview={setPreview}
              allUsers={allUsers}
              setThisUsers={setThisUsers}
              setAllUsers={setAllUsers}
              setIsEditMode={setIsEditMode}
              loading={loading}
              setProcessing={setProcessing}
              routeAccess={routeAccess}
              snackOpen={snackOpen}
              setSnackOpen={setSnackOpen}
              snackOptions={snackOptions}
              setSnackOptions={setSnackOptions}
            />
          ) : (
            <UsersForm
              thisUsers={thisUsers}
              setThisUsers={setThisUsers}
              initialUserState={initialUserState}
              setpreview={setPreview}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              addUser={addUser}
              updateUser={updateUser}
              allUserTypes={allUserTypes}
              processing={processing}
              setProcessing={setProcessing}
              setSnackOpen={setSnackOpen}
              setSnackOptions={setSnackOptions}
            />
          )}
          <Snackbar
            open={snackOpen}
            setOpen={setSnackOpen}
            options={snackOptions}
          />
        </Container>
      </Box>
    </React.Fragment>
  );
}
