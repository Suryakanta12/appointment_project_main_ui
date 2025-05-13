/**
 * * Project Name : Appointment
 * * Layer Name : Database
 * * Section : BussinessType
 * * Parent : Admin
 * Description : design BussinessType primary admin with Database
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
import BussinessTypeForm from "./Form/BussinessTypeForm.jsx";
import BussinessTypePreview from "./Preview/BussinessTypePreview.jsx";
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
const API_GetAllBussinessType = "api/v1/businesstype/all-businesstypes";
const API_AddBussinessType = "api/v1/businesstype/add-businesstypes";

/** ------------------ Third Party Components ------------ */

export default function BussinessType(props) {
  const navigate = useNavigate();
  /** ------------------ Initial States -------------------- */
  const context = useContext(AuthContext);
  const initialBussinessTypeState = {
    Business_Type_Id: null,
    Business_Type_Name: "",
    Business_Type_Desc: "",
    Business_Code: "",
    Business_Status: "",
    Is_Active: "N",
    Business_Media: "",
    Added_By: context.state.user.User_Id,
    Added_On: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  };
  /** ------------------ useStates ------------------------- */
  const [routeAccess, setRouteAccess] = useState(
    CheckRouteAccess(window.location.pathname),
  );
  const [allBussinessType, setAllBussinessType] = useState([]);
  const [thisBussinessType, setThisBussinessType] = useState(
    initialBussinessTypeState,
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
    getRecord(API_GetAllBussinessType, {}).then((response) => {
      if (response.status === "success" && componentMounted && preview) {
        setAllBussinessType(response.data);
        setLoading(false);
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [preview]);
  /** ------------------ Functions & Events ---------------- */
  const addUserType = () => {
    postRecord(API_AddBussinessType, thisBussinessType)
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
    const userTypeId = thisBussinessType.Business_Type_Id;

    if (!userTypeId) {
      setSnackOptions({
        color: "error",
        message: 'Please Check internet connection. Refresh and Try again!',
      });
      setSnackOpen(true);
      return;
    }

    // Add metadata
    thisBussinessType.Modified_By = context.state.user.User_Id;
    thisBussinessType.Modified_On = moment(new Date()).format(
      "YYYY-MM-DD HH:mm:ss",
    );

    // Replace placeholder with actual ID
    const endpoint = `api/v1/businesstype/update-businesstypes/${userTypeId}`;

    // Make PUT call
    putRecord(endpoint, thisBussinessType)
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
    setThisBussinessType(initialBussinessTypeState);
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
            <Typography variant="h6"> Bussiness Type</Typography>
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
                      Bussiness Type
                    </Button>
                    <Typography sx={{ color: "text.primary" }}>
                      {preview ? (
                        "Bussiness Type List"
                      ) : (
                        <>
                          {isEditMode
                            ? "Edit Bussiness Type"
                            : "Add New Bussiness Type"}
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
                  <Tooltip title="Add new  Bussiness Type" placement="top">
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
            <BussinessTypePreview
              setPreview={setPreview}
              allBussinessType={allBussinessType}
              setThisBussinessType={setThisBussinessType}
              setAllBussinessType={setAllBussinessType}
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
            <BussinessTypeForm
              thisBussinessType={thisBussinessType}
              setThisBussinessType={setThisBussinessType}
              initialBussinessTypeState={initialBussinessTypeState}
              setpreview={setPreview}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
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
