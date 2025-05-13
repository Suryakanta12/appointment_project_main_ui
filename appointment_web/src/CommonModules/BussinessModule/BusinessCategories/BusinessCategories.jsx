/**
 * * Project Name : Appointment
 * * Layer Name : Database
 * * Section : BusinessCategories
 * * Parent : Admin
 * Description : design BusinessCategories primary admin with Database
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
import BusinessCategoriesForm from "./Form/BusinessCategoriesForm.jsx";
import BusinessCategoriesPreview from "./Preview/BusinessCategoriesPreview.jsx";
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
const API_GetAllBusinessCategories =
  "api/v1/businesscategories/all-businesscategories";
const API_AddBusinessCategories =
  "api/v1/businesscategories/add-businesscategories";
const API_GetAllBussinessType = "api/v1/businesstype/all-businesstypes";

/** ------------------ Third Party Components ------------ */

export default function (props) {
  const navigate = useNavigate();
  /** ------------------ Initial States -------------------- */
  const context = useContext(AuthContext);
  const initialBusinessCategoriesState = {
    Business_Category_Id: null,
    Business_Type_Id: "",
    Business_Category_Name: "",
    Business_Category_Short_Name: "",
    Business_Category_Code: "",
    Business_Category_Description: "",
    Is_Active: "N",
    Business_Category_Media: "",
    Added_By: context.state.user.User_Id,
    Added_On: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  };
  /** ------------------ useStates ------------------------- */
  const [routeAccess, setRouteAccess] = useState(
    CheckRouteAccess(window.location.pathname),
  );
    const [allBusinessCategories, setAllBusinessCategories] = useState([]);
    const [allBussinessType, setAllBussinessType] = useState([]);
  const [thisBusinessCategories, setThisBusinessCategories] = useState(
    initialBusinessCategoriesState,
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
      getRecord(API_GetAllBusinessCategories, {}).then((response) => {
      if (response.status === "success" && componentMounted && preview) {
        setAllBusinessCategories(response.data);
        setLoading(false);
      }
    });
    return () => {
      componentMounted = false;
    };
  }, [preview]);
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
  const addBusinessCategories = () => {
    postRecord(API_AddBusinessCategories, thisBusinessCategories)
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
  const updateBusinessCategories = () => {
    const businessCategoriesId = thisBusinessCategories.Business_Category_Id;

    if (!businessCategoriesId) {
      setSnackOptions({
        color: "error",
        message: "Please Check internet connection. Refresh and Try again!",
      });
      setSnackOpen(true);
      return;
    }

    // Add metadata
    thisBusinessCategories.Modified_By = context.state.user.User_Id;
    thisBusinessCategories.Modified_On = moment(new Date()).format(
      "YYYY-MM-DD HH:mm:ss",
    );

    // Replace placeholder with actual ID
    const endpoint = `api/v1/businesstype/update-businesstypes/${businessCategoriesId}`;

    // Make PUT call
    putRecord(endpoint, thisBusinessCategories)
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
    setThisBusinessCategories(initialBusinessCategoriesState);
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
            <Typography variant="h6"> Business Categories</Typography>
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
                      Business Categories
                    </Button>
                    <Typography sx={{ color: "text.primary" }}>
                      {preview ? (
                        "Business Categories List"
                      ) : (
                        <>
                          {isEditMode
                            ? "Edit Business Categories"
                            : "Add New Business Categories"}
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
                  <Tooltip title="Add new  Business Categories" placement="top">
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
            <BusinessCategoriesPreview
              setPreview={setPreview}
              allBusinessCategories={allBusinessCategories}
              setThisBusinessCategories={setThisBusinessCategories}
              setAllBusinessCategories={setAllBusinessCategories}
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
            <BusinessCategoriesForm
              thisBusinessCategories={thisBusinessCategories}
              setThisBusinessCategories={setThisBusinessCategories}
              initialBusinessCategoriesState={initialBusinessCategoriesState}
              setpreview={setPreview}
              allBussinessType={allBussinessType}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              addBusinessCategories={addBusinessCategories}
              updateBusinessCategories={updateBusinessCategories}
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
