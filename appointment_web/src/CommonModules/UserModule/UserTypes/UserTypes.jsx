/**
 * * Project Name : Appointment
 * * Layer Name : Database
 * * Section : UserTypes
 * * Parent : Admin
 * Description : design UserTypes primary admin with Database
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
import UserTypesForm from "./Form/UserTypesForm.jsx";
import UserTypesPreview from "./Preview/UserTypesPreview.jsx";
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
const API_GetAllUserTypes = "api/v1/usertypes/all-usertypes";
const API_AddUserTypes = "api/v1/usertypes/add-usertypes";
const API_UpdateUserTypes = "api/v1/usertypes/update-usertypes/{user_type_id}";
const API_GetAllPages = "api/v1/pages/pages";

/** ------------------ Third Party Components ------------ */

export default function UserTypes(props) {
  const navigate = useNavigate();
  /** ------------------ Initial States -------------------- */
  const context = useContext(AuthContext);
  const initialUserTypesState = {
    User_Type_Id: null,
    User_Type_Name: "",
    User_Type_Desc: "",
    Default_Page: "",
    Is_Member: "N",
    Is_Active: "N",
    Added_By: context.state.user.User_Id,
    Added_On: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  };
  /** ------------------ useStates ------------------------- */
  const [routeAccess, setRouteAccess] = useState(
    CheckRouteAccess(window.location.pathname),
  );
  const [allUserTypes, setAllUserTypes] = useState([]);
  const [thisUserTypes, setThisUserTypes] = useState(initialUserTypesState);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [allPages, setAllPages] = useState([]);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackOptions, setSnackOptions] = useState({
    color: "success",
    message: "Hi",
  });
  /** ------------------ useEffects ------------------------ */
  useEffect(() => {
    let componentMounted = true;
    // console.log();
    getRecord(API_GetAllUserTypes, {}).then((response) => {
      if (response.status === "success" && componentMounted && preview) {
        setAllUserTypes(response.data);
        setLoading(false);
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [preview]);
  /** ------------------ useEffects----Pages--------------------- */

  useEffect(() => {
    let componentMounted = true;
    getRecord(API_GetAllPages, {}).then((response) => {
      if (response.status === "success" && componentMounted && !preview) {
        setAllPages(
          response.data.filter(
            (x) => x.Page_Parent_Id !== 0 && x.Page_Parent_Id !== 1,
          ),
        );
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [preview]);
  /** ------------------ Functions & Events ---------------- */
  const addUserType = () => {
    postRecord(API_AddUserTypes, thisUserTypes)
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
  const updateUserType = () => {
    const userTypeId = thisUserTypes.User_Type_Id;

    if (!userTypeId) {
      setSnackOptions({
        color: response.data.color,
        message: response.data.message,
      });
      setSnackOpen(true);
      return;
    }

    // Add metadata
    thisUserTypes.Modified_By = context.state.user.User_Id;
    thisUserTypes.Modified_On = moment(new Date()).format(
      "YYYY-MM-DD HH:mm:ss",
    );

    // Replace placeholder with actual ID
    const endpoint = `api/v1/usertypes/update-usertypes/${userTypeId}`;

    // Make PUT call
    putRecord(endpoint, thisUserTypes)
      .then((response) => {
        if (response.status === "success") {
          setSnackOptions({
            color: response.data.color,
            message: response.data.message,
          });
        } else {
          setSnackOptions({
            color: response.data.color,
            message: response.data.message,
          });
        }
        setProcessing(false);
        setSnackOpen(true);
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
    setThisUserTypes(initialUserTypesState);
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
            <Typography variant="h6"> Users Types</Typography>
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
                      User Types
                    </Button>
                    <Typography sx={{ color: "text.primary" }}>
                      {preview ? (
                        "User Types List"
                      ) : (
                        <>
                          {isEditMode
                            ? "Edit User Types"
                            : "Add New User Types"}
                        </>
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
                  <Tooltip title="Add new  User Types" placement="top">
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
            <UserTypesPreview
              setPreview={setPreview}
              allUserTypes={allUserTypes}
              setThisUserTypes={setThisUserTypes}
              setAllUserTypes={setAllUserTypes}
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
            <UserTypesForm
              thisUserTypes={thisUserTypes}
              setThisUserTypes={setThisUserTypes}
              initialUserTypesState={initialUserTypesState}
              setpreview={setPreview}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              allPages={allPages}
              addUserType={addUserType}
              updateUserType={updateUserType}
              processing={processing}
              setProcessing={setProcessing}
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
