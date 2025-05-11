/**
 * * Project Name : Appointment
 * * Layer Name : Database
 * * Section : UserPermission
 * * Parent : Admin
 * Description : design UserPermission primary admin with Database
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
import UserPermissionForm from "./Form/UserPermissionForm.jsx";
import UserPermissionPreview from "./Preview/UserPermissionPreview.jsx";
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
const API_GetAllUserPermission = "api/v1/userpermissions/all-userpermission";
const API_AddUserPermission = "api/v1/userpermissions/add-userpermission";
const API_GetAllPages = "api/v1/pages/all-pages";
const API_GetAllUserTypes = "api/v1/usertypes/all-usertypes";

/** ------------------ Third Party Components ------------ */

export default function UserPermission(props) {
  const navigate = useNavigate();
  /** ------------------ Initial States -------------------- */
  const context = useContext(AuthContext);
  const initialUserPermissionState = {
    User_Permission_Id: null,
    User_Type_Id: "",
    Page_Id: "",
    Can_View: "",
    Can_Create: "",
    Can_Update: "",
    Can_Delete: "N",
    Added_By: context.state.user.User_Id,
    Added_On: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  };
  /** ------------------ useStates ------------------------- */
  const [routeAccess, setRouteAccess] = useState(
    CheckRouteAccess(window.location.pathname),
  );
  const [allUserPermission, setAllUserPermission] = useState([]);
  const [thisUserPermission, setThisUserPermission] = useState(
    initialUserPermissionState,
  );
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [allPages, setAllPages] = useState([]);
const [allUserTypes, setAllUserTypes] = useState([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackOptions, setSnackOptions] = useState({
    color: "success",
    message: "Hi",
  });
  /** ------------------ useEffects ------------------------ */
  useEffect(() => {
    let componentMounted = true;
    // console.log();
    getRecord(API_GetAllUserPermission, {}).then((response) => {
      if (response.status === "success" && componentMounted && preview) {
        setAllUserPermission(response.data);
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
          setAllPages(response.data);
        // setAllPages(
        //   response.data.filter(
        //     (x) => x.Page_Parent_Id !== 0 && x.Page_Parent_Id !== 1,
        //   ),
        // );
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [preview]);
      useEffect(() => {
        let componentMounted = true;
        // console.log();
        getRecord(API_GetAllUserTypes, {}).then((response) => {
          if (response.status === "success" && componentMounted && !preview) {
            setAllUserTypes(response.data);
          }
        });
        return () => {
          componentMounted = false;
        };
      }, [preview]);
  /** ------------------ Functions & Events ---------------- */
  const addUserPermission = () => {
    postRecord(API_AddUserPermission, thisUserPermission)
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
  const updateUserPermission = () => {
    const userPermissionId = thisUserPermission.User_Permission_Id;

    if (!userPermissionId) {
      setSnackOptions({
        color: response.data.color,
        message: response.data.message,
      });
      setSnackOpen(true);
      return;
    }

    // Add metadata
    thisUserPermission.Modified_By = context.state.user.User_Id;
    thisUserPermission.Modified_On = moment(new Date()).format(
      "YYYY-MM-DD HH:mm:ss",
    );

    // Replace placeholder with actual ID
    const endpoint = `api/v1/userpermissions/update-userpermission/${userPermissionId}`;

    // Make PUT call
    putRecord(endpoint, thisUserPermission)
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
    setThisUserPermission(initialUserPermissionState);
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
            <Typography variant="h6"> User Permission</Typography>
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
                      User Permission
                    </Button>
                    <Typography sx={{ color: "text.primary" }}>
                      {preview ? (
                        "User Permission List"
                      ) : (
                        <>
                          {isEditMode
                            ? "Edit User Permission"
                            : "Add New User Permission"}
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
                  <Tooltip title="Add new  User Permission" placement="top">
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
            <UserPermissionPreview
              setPreview={setPreview}
              allUserPermission={allUserPermission}
              setThisUserPermission={setThisUserPermission}
              setAllUserPermission={setAllUserPermission}
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
            <UserPermissionForm
              thisUserPermission={thisUserPermission}
              setThisUserPermission={setThisUserPermission}
              initialUserPermissionState={initialUserPermissionState}
              setpreview={setPreview}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              allPages={allPages}
              addUserPermission={addUserPermission}
              updateUserPermission={updateUserPermission}
              processing={processing}
              setProcessing={setProcessing}
              allUserTypes={allUserTypes}
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
