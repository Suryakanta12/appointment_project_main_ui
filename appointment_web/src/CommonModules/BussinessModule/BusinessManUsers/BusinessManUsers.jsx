/**
 * * Project Name : Appointment
 * * Layer Name : Database
 * * Section : BusinessManUsers
 * * Parent : Admin
 * Description : design BusinessManUsers primary admin with Database
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
import BusinessManUsersForm from "./Form/BusinessManUsersForm.jsx";
import BusinessManUsersPreview from "./Preview/BusinessManUsersPreview.jsx";
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
const API_GetAllBusinessManUsers =
  "api/v1/businessmanuser/all-businessmanusers";
// const API_AddBusinessManUsers =
//   "api/v1/businesscategories/add-businesscategories";
const API_GetAllBussinessType = "api/v1/businesstype/all-businesstypes";
const API_GetAllUsers = "api/v1/users/all-users";
const API_GetAllUserTypes = "api/v1/usertypes/all-usertypes";

/** ------------------ Third Party Components ------------ */

export default function BusinessManUsers(props) {
  const navigate = useNavigate();
  /** ------------------ Initial States -------------------- */
  const context = useContext(AuthContext);
  const initialBusinessManUsersState = {
    Businessman_User_Id: null,
    User_Id: "",
    User_Type_Id: "",
    Business_Type_Id: "",
    Brand_Name: "",
    Business_Type_Name: "",
    Business_Status: "",
    Bussiness_Logo: "",
    Bussiness_Banner: "",
    Bussiness_Description: "",
    Is_Active: "N",
    Added_By: context.state.user.User_Id,
    Added_On: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  };
  /** ------------------ useStates ------------------------- */
  const [routeAccess, setRouteAccess] = useState(
    CheckRouteAccess(window.location.pathname),
  );
  const [allBusinessManUsers, setAllBusinessManUsers] = useState([]);
  const [allBussinessType, setAllBussinessType] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allUserTypes, setAllUserTypes] = useState([]);
  const [thisBusinessManUsers, setThisBusinessManUsers] = useState(
    initialBusinessManUsersState,
  );
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
    // console.log();
    getRecord(API_GetAllBusinessManUsers, {}).then((response) => {
      if (response.status === "success" && componentMounted && preview) {
        setAllBusinessManUsers(response.data);
        setLoading(false);
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [preview]);
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
        if (response.status === "success" && componentMounted) {
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

    return () => {
      componentMounted = false;
    };
  }, []);
  useEffect(() => {
    let componentMounted = true;
    // console.log();
    getRecord(API_GetAllBussinessType, {}).then((response) => {
      if (response.status === "success" && componentMounted && !preview) {
        setAllBussinessType(response.data);
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [!preview]);
  /** ------------------ Functions & Events ---------------- */
  // const addBusinessManUsers = () => {
  //   postRecord(API_AddBusinessManUsers, thisBusinessManUsers)
  //     .then((response) => {
  //       if (response.status === "success") {
  //         setSnackOptions({ color: response.color, message: response.message });
  //         resetAndPreview();
  //       } else {
  //         setSnackOptions({ color: response.color, message: response.message });
  //       }
  //       setProcessing(false);
  //       setSnackOpen(true);
  //     })
  //     .catch((err) => {
  //       setSnackOptions({
  //         color: "error",
  //         message: err.response.data.detail,
  //       });
  //       setSnackOpen(true);
  //       setProcessing(false);
  //     });
  // };
  const updateBusinessManUsers = () => {
    const businessManUserId = thisBusinessManUsers.Businessman_User_Id;

    if (!businessManUserId) {
      setSnackOptions({
        color: "error",
        message: "Please Check internet connection. Refresh and Try again!",
      });
      setSnackOpen(true);
      return;
    }

    // Add metadata
    thisBusinessManUsers.Modified_By = context.state.user.User_Id;
    thisBusinessManUsers.Modified_On = moment(new Date()).format(
      "YYYY-MM-DD HH:mm:ss",
    );

    // Replace placeholder with actual ID
    const endpoint = `api/v1/businessmanuser/update-businessmanusers/${businessManUserId}`;

    // Make PUT call
    putRecord(endpoint, thisBusinessManUsers)
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
    setThisBusinessManUsers(initialBusinessManUsersState);
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
            <Typography variant="h6"> Business Man Users</Typography>
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
                      Business Man Users
                    </Button>
                    <Typography sx={{ color: "text.primary" }}>
                      {preview ? (
                        "Business Man Users List"
                      ) : (
                        <>
                          {isEditMode
                            ? "Edit Business Man Users"
                            : "Add New Business Man Users"}
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
                {/* {!isEditMode && (
                  <Tooltip title="Add new  Business Man Users" placement="top">
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
                )} */}
              </Box>
            </Box>
          </Box>
          {preview ? (
            <BusinessManUsersPreview
              setPreview={setPreview}
              allBusinessManUsers={allBusinessManUsers}
              setThisBusinessManUsers={setThisBusinessManUsers}
              setAllBusinessManUsers={setAllBusinessManUsers}
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
            <BusinessManUsersForm
              thisBusinessManUsers={thisBusinessManUsers}
              setThisBusinessManUsers={setThisBusinessManUsers}
              initialBusinessManUsersState={initialBusinessManUsersState}
              setpreview={setPreview}
              allBussinessType={allBussinessType}
              allUserTypes={allUserTypes}
              allUsers={allUsers}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              // addBusinessManUsers={addBusinessManUsers}
              updateBusinessManUsers={updateBusinessManUsers}
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
