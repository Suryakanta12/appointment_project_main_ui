/**
 * * Project Name : Appointment
 * * Layer Name : Database
 * * Section : Pages
 * * Parent : Admin
 * Description : design Pages primary admin with Database
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
import PagesForm from "./Form/PagesForm.jsx";
import PagesPreview from "./Preview/PagesPreview.jsx";
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
const API_GetAllPages = "api/v1/pages/all-pages";
const API_AddPages = "api/v1/pages/add-pages";

/** ------------------ Third Party Components ------------ */

export default function Pages(props) {
  const navigate = useNavigate();
  /** ------------------ Initial States -------------------- */
  const context = useContext(AuthContext);
  const initialPagesState = {
    Page_Id: null,
    Page_Name: "",
    Page_Display_Text: "",
    Page_Navigation_URL: "",
    Page_Parent_Id: "0",
    Is_Internal: "N",
    Added_By: context.state.user.User_Id,
    Added_On: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  };
  /** ------------------ useStates ------------------------- */
  const [routeAccess, setRouteAccess] = useState(
    CheckRouteAccess(window.location.pathname),
  );
  const [allPages, setAllPages] = useState([]);
  const [thisPages, setThisPages] = useState(initialPagesState);
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
    getRecord(API_GetAllPages, {}).then((response) => {
      if (response.status === "success" && componentMounted && preview) {
        setAllPages(response.data);
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
  const addPages = () => {
    postRecord(API_AddPages, thisPages)
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
  const updatePages = () => {
    const pageId = thisPages.Page_Id;

    if (!pageId) {
      setSnackOptions({
        color: response.data.color,
        message: response.data.message,
      });
      setSnackOpen(true);
      return;
    }

    // Add metadata
    thisPages.Modified_By = context.state.user.User_Id;
    thisPages.Modified_On = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    // Replace placeholder with actual ID
    const endpoint = `api/v1/pages/update-pages/${pageId}`;

    // Make PUT call
    putRecord(endpoint, thisPages)
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
    setThisPages(initialPagesState);
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
            <Typography variant="h6"> Pages</Typography>
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
                      Pages
                    </Button>
                    <Typography sx={{ color: "text.primary" }}>
                      {preview ? (
                        "Pages List"
                      ) : (
                        <>{isEditMode ? "Edit Pages" : "Add New Pages"}</>
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
                  <Tooltip title="Add new  Pages" placement="top">
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
            <PagesPreview
              setPreview={setPreview}
              allPages={allPages}
              setThisPages={setThisPages}
              setAllPages={setAllPages}
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
            <PagesForm
              thisPages={thisPages}
              setThisPages={setThisPages}
              initialPagesState={initialPagesState}
              setpreview={setPreview}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              allPages={allPages}
              addPages={addPages}
              updatePages={updatePages}
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
