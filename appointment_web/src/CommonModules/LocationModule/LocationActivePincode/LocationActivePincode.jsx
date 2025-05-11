/**
 * * Project Name : Appointment
 * * Layer Name : Database
 * * Section : LocationActivePincode
 * * Parent : Admin
 * Description : design LocationActivePincode primary admin with Database
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
import LocationActivePincodeForm from "./Form/LocationActivePincodeForm.jsx";
import LocationActivePincodePreview from "./Preview/LocationActivePincodePreview.jsx";
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
const API_GetAllLocationActivePincode =
  "api/v1/locationactivepincode/all-locationactivepincode";
const API_AddLocationActivePincode =
  "api/v1/locationactivepincode/add-locationactivepincode";

/** ------------------ Third Party Components ------------ */

export default function LocationActivePincode(props) {
  const navigate = useNavigate();
  /** ------------------ Initial States -------------------- */
  const context = useContext(AuthContext);
  const initialLocationActivePincodeState = {
    Pincode_Id: null,
    Pincode: "",
    Location_Id: "",
    Location_Status: "",
    Is_Active: "N",
    Added_By: context.state.user.User_Id,
    Added_On: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  };
  /** ------------------ useStates ------------------------- */
  const [routeAccess, setRouteAccess] = useState(
    CheckRouteAccess(window.location.pathname),
  );
  const [allLocationActivePincode, setAllLocationActivePincode] = useState([]);
  const [thisLocationActivePincode, setThisLocationActivePincode] = useState(
    initialLocationActivePincodeState,
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
    getRecord(API_GetAllLocationActivePincode, {}).then((response) => {
      if (response.status === "success" && componentMounted && preview) {
        setAllLocationActivePincode(response.data);
        setLoading(false);
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [preview]);


  /** ------------------ Functions & Events ---------------- */
  const addLocationActivePincode = () => {
    postRecord(API_AddLocationActivePincode, thisLocationActivePincode)
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
        console.log(err);
        // setSnackOptions({
        //   color: "error",
        //   message: err.response.data.detail,
        // });
        // setSnackOpen(true);
        setProcessing(false);
      });
  };
  const updateLocationActivePincode = () => {
    const locationId = thisLocationActivePincode.Pincode_Id;

    if (!locationId) {
      setSnackOptions({
        color: response.data.color,
        message: response.data.message,
      });
      setSnackOpen(true);
      return;
    }

    // Add metadata
    thisLocationActivePincode.Modified_By = context.state.user.User_Id;
    thisLocationActivePincode.Modified_On = moment(new Date()).format(
      "YYYY-MM-DD HH:mm:ss",
    );

    // Replace placeholder with actual ID
    const endpoint = `api/v1/locationactivepincode/update-locationactivepincode/${locationId}`;

    // Make PUT call
    putRecord(endpoint, thisLocationActivePincode)
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
    setThisLocationActivePincode(initialLocationActivePincodeState);
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
            <Typography variant="h6"> Location Active Pincode</Typography>
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
                      Location Active Pincode
                    </Button>
                    <Typography sx={{ color: "text.primary" }}>
                      {preview ? (
                        "Location Active Pincode List"
                      ) : (
                        <>
                          {isEditMode
                            ? "Edit Location Active Pincode"
                            : "Add New Location Active Pincode"}
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
                  <Tooltip title="Add new Location Active Pincode" placement="top">
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
            <LocationActivePincodePreview
              setPreview={setPreview}
              allLocationActivePincode={allLocationActivePincode}
              setThisLocationActivePincode={setThisLocationActivePincode}
              setAllLocationActivePincode={setAllLocationActivePincode}
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
            <LocationActivePincodeForm
              thisLocationActivePincode={thisLocationActivePincode}
              setThisLocationActivePincode={setThisLocationActivePincode}
              initialLocationActivePincodeState={
                initialLocationActivePincodeState
              }
              setpreview={setPreview}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              addLocationActivePincode={addLocationActivePincode}
              updateLocationActivePincode={updateLocationActivePincode}
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
