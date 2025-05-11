/**
 * * Project Name : Appointment
 * * Layer Name : Database
 * * Section : Pages Form
 * * Parent : Admin
 * Description : design Pages form primary admin with Database
 * Author: Suryakanta sahu
 * Date Created: 10-May-2025
 *
 *
 *
 *
 *
 */
/** --------------------- Primary Import Declaration ------------- */
import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

/** --------------------- MUI Components & APIs ------------------ */
import {
  Box,
  Container,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  CircularProgress,
} from "@mui/material";
/** ------------------ User Components ------------------- */
/** ------------------ Icons ----------------------------- */
import SaveIcon from "@mui/icons-material/Save";
/** ------------------ Media Imports --------------------- */
/** ------------------ Style Components ------------------ */
/** ------------------ API Declarations ------------------ */
/** ------------------ Third Party Components ------------ */

export default function PagesForm(props) {
  /** ------------------ Props ------------------------- */
  const {
    thisPages,
    setThisPages,
    isEditMode,
    addPages,
    updatePages,
    allPages,
    processing,
    setProcessing,
  } = props;
  /** ------------------ Initial States -------------------- */
  /** ------------------ useStates ------------------------- */
  /** ------------------ useEffects ------------------------ */
  /** ------------------ Functions & Events ---------------- */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setThisPages({ ...thisPages, [name]: value });
  };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    var ischecked = checked ? "Y" : "N";
    setThisPages({ ...thisPages, [name]: ischecked });
  };
  const handleSubmit = () => {
    setProcessing(true);
    isEditMode ? updatePages() : addPages();
  };
  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Paper elevation={1} sx={{ p: 5 }}>
          <form
            onSubmit={(event) => {
              event.preventDefault();

              thisPages.Page_Parent_Id = parseInt(thisPages.Page_Parent_Id);
              // console.log(thisPages)
              handleSubmit();
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  required
                  label="Page Name"
                  fullWidth
                  variant="outlined"
                  name="Page_Name"
                  value={thisPages.Page_Name}
                  onChange={handleInputChange}
                  inputProps={{
                    maxLength: 25,
                    minLength: 1,
                    title:
                      "length must be numeric, minimum 1 and maximum digits",
                  }}
                  helperText="Length- Minimum 1, Maximum 25"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  required
                  label="Page Display Text"
                  fullWidth
                  variant="outlined"
                  name="Page_Display_Text"
                  value={thisPages.Page_Display_Text}
                  onChange={handleInputChange}
                  inputProps={{
                    maxLength: 199,
                    minLength: 1,
                    title:
                      "length must be numeric, minimum 1 and maximum digits",
                  }}
                  helperText="Length- Minimum 1, Maximum 199"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  required
                  id="outlined-basic"
                  label="Page Navigation Url"
                  fullWidth
                  name="Page_Navigation_URL"
                  value={thisPages.Page_Navigation_URL}
                  onChange={handleInputChange}
                  variant="outlined"
                  inputProps={{
                    maxLength: 199,
                    minLength: 1,
                    title:
                      "length must be numeric, minimum 1 and maximum digits",
                  }}
                  helperText="Length- Minimum 1, Maximum 199"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  select
                  required
                  label="Select Parent"
                  fullWidth
                  variant="outlined"
                  name="Page_Parent_Id"
                  value={thisPages.Page_Parent_Id}
                  onChange={handleInputChange}
                  defaultValue="0"
                >
                  <MenuItem value="0">No Parent</MenuItem>
                  {allPages &&
                    allPages.length > 0 &&
                    allPages
                      .filter(
                        (x) =>
                          x.Page_Parent_Id === 0 || x.Page_Parent_Id == null,
                      )
                      .map((Pages) => (
                        <MenuItem value={Pages.Page_Id} key={Pages.Page_Id}>
                          {Pages.Page_Name}
                        </MenuItem>
                      ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="Is_Internal"
                      value={thisPages.Is_Internal}
                      onChange={handleCheckboxChange}
                      checked={thisPages.Is_Internal === "Y" ? true : false}
                    />
                  }
                  label="Is Internal"
                  labelPlacement="end"
                />
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                type="submit"
                sx={{ mt: 3, ml: 1 }}
                disabled={processing}
                startIcon={
                  processing ? <CircularProgress size={20} /> : <SaveIcon />
                }
              >
                {isEditMode ? "Update" : "Add"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </React.Fragment>
  );
}
