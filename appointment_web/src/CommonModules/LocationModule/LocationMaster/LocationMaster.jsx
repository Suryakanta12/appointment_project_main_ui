/**
 * * Project Name : Appointment
 * * Layer Name : Database
 * * Section : LocationMaster
 * * Parent : Admin
 * Description : design LocationMaster primary admin with Database
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
import LocationMasterForm from "./Form/LocationMasterForm.jsx";
import LocationMasterPreview from "./Preview/LocationMasterPreview.jsx";
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
const API_GetAllLocationMaster = "api/v1/locationmaster/all-locationmaster";
const API_AddLocationMaster = "api/v1/locationmaster/add-locationmaster";

/** ------------------ Third Party Components ------------ */

export default function LocationMaster(props) {
  const navigate = useNavigate();
  /** ------------------ Initial States -------------------- */
  const context = useContext(AuthContext);
  const initialLocationMasterState = {
    Location_Id: null,
    Location_Name: "",
    Location_City_Name: "",
    Location_Dist_Name: "",
    Location_State_Name: "",
    Location_Country_Name: "India",
    Location_Desc: "",
    Is_Active: "N",
    Added_By: context.state.user.User_Id,
    Added_On: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  };
  /** ------------------ useStates ------------------------- */
  const [routeAccess, setRouteAccess] = useState(
    CheckRouteAccess(window.location.pathname),
  );
  const [allLocationMaster, setAllLocationMaster] = useState([]);
  const [thisLocationMaster, setThisLocationMaster] = useState(
    initialLocationMasterState,
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
    getRecord(API_GetAllLocationMaster, {}).then((response) => {
      if (response.status === "success" && componentMounted && preview) {
        setAllLocationMaster(response.data);
        setLoading(false);
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [preview]);

  // useEffect(() => {
  //   let componentMounted = true;
  //   if (
  //     thisLocationMaster.Location_State_Name &&
  //     thisLocationMaster.Location_Dist_Name
  //   ) {
  //     fetch(
  //       `https://api.postalpincode.in/postoffice/${thisLocationMaster.Location_Dist_Name}`,
  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log("data", data[0]);
  //         if (data[0]?.Status === "Success") {
  //          var dists = data[0].PostOffice.map(
  //            (dist) => dist.District,
  //          );
  //           console.log("dist", dists);
  //           const pins = data[0].PostOffice.map((po) => po.Pincode);
  //           console.log([...new Set(pins)]);
  //           // setPincodes([...new Set(pins)]); // remove duplicates
  //         } else {
  //           console.log([]);
  //           // setPincodes([]);
  //         }
  //       })
  //       .catch((err) => {
  //         console.error("API Error:", err);
  //         // setPincodes([]);
  //       });
  //   }
  //   return () => {
  //     componentMounted = false;
  //   };
  // }, [
  //   thisLocationMaster.Location_State_Name,thisLocationMaster.Location_Dist_Name,
  // ]);

  /** ------------------ Functions & Events ---------------- */
  const addLocationMaster = () => {
    postRecord(API_AddLocationMaster, thisLocationMaster)
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
  const updateLocationMaster = () => {
    const locationId = thisLocationMaster.Location_Id;

    if (!locationId) {
      setSnackOptions({
        color: response.data.color,
        message: response.data.message,
      });
      setSnackOpen(true);
      return;
    }

    // Add metadata
    thisLocationMaster.Modified_By = context.state.user.User_Id;
    thisLocationMaster.Modified_On = moment(new Date()).format(
      "YYYY-MM-DD HH:mm:ss",
    );

    // Replace placeholder with actual ID
    const endpoint = `api/v1/locationmaster/update-locationmaster/${locationId}`;

    // Make PUT call
    putRecord(endpoint, thisLocationMaster)
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
    setThisLocationMaster(initialLocationMasterState);
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
            <Typography variant="h6"> Location Master</Typography>
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
                      Location Master
                    </Button>
                    <Typography sx={{ color: "text.primary" }}>
                      {preview ? (
                        "Location Master List"
                      ) : (
                        <>
                          {isEditMode
                            ? "Edit Location Master"
                            : "Add New Location Master"}
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
                  <Tooltip title="Add new Location Master" placement="top">
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
            <LocationMasterPreview
              setPreview={setPreview}
              allLocationMaster={allLocationMaster}
              setThisLocationMaster={setThisLocationMaster}
              setAllLocationMaster={setAllLocationMaster}
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
            <LocationMasterForm
              thisLocationMaster={thisLocationMaster}
              setThisLocationMaster={setThisLocationMaster}
              initialLocationMasterState={initialLocationMasterState}
              setpreview={setPreview}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              addLocationMaster={addLocationMaster}
              updateLocationMaster={updateLocationMaster}
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
