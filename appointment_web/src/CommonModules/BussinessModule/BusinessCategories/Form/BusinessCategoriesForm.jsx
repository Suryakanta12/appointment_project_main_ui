/**
 * * Project Name : Appointment
 * * Layer Name : Database
 * * Section : BusinessCategories Form
 * * Parent : Admin
 * Description : design BusinessCategories form primary admin with Database
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

export default function BusinessCategoriesForm(props) {
  /** ------------------ Props ------------------------- */
  const {
    thisBusinessCategories,
    setThisBusinessCategories,
    isEditMode,
    addBusinessCategories,
    updateBusinessCategories,
    processing,
    setProcessing,
    allBussinessType,
  } = props;
  /** ------------------ Initial States -------------------- */
  /** ------------------ useStates ------------------------- */
  /** ------------------ useEffects ------------------------ */
  /** ------------------ Functions & Events ---------------- */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setThisBusinessCategories({ ...thisBusinessCategories, [name]: value });
  };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    var ischecked = checked ? "Y" : "N";
    setThisBusinessCategories({ ...thisBusinessCategories, [name]: ischecked });
  };
  const handleSubmit = () => {
    setProcessing(true);
    isEditMode ? updateBusinessCategories() : addBusinessCategories();
  };
  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Paper elevation={1} sx={{ p: 5 }}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  required
                  select
                  label="Select Business Type"
                  fullWidth
                  variant="outlined"
                  name="Business_Type_Id"
                  value={thisBusinessCategories.Business_Type_Id}
                  onChange={handleInputChange}
                >
                  {allBussinessType &&
                    allBussinessType.length > 0 &&
                    allBussinessType.map((buss) => (
                      <MenuItem
                        value={buss.Business_Type_Id}
                        key={buss.Business_Type_Id}
                      >
                        {buss.Business_Type_Name}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  required
                  label="Business Category Name"
                  fullWidth
                  variant="outlined"
                  name="Business_Category_Name"
                  value={thisBusinessCategories.Business_Category_Name}
                  onChange={handleInputChange}
                  inputProps={{
                    maxLength: 100,
                    minLength: 1,
                    title:
                      "length must be numeric, minimum 1 and maximum digits",
                  }}
                  helperText="Length- Minimum 1, Maximum 50"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  required
                  label="Business Category Short Name"
                  fullWidth
                  variant="outlined"
                  name="Business_Category_Short_Name"
                  value={thisBusinessCategories.Business_Category_Short_Name}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  label="Descriptions"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  name="Business_Category_Description"
                  value={thisBusinessCategories.Business_Category_Description}
                  onChange={handleInputChange}
                  inputProps={{
                    maxLength: 250,
                    minLength: 1,
                    title:
                      "length must be numeric, minimum 1 and maximum digits",
                  }}
                  helperText="Length- Minimum 1, Maximum 250"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="Is_Active"
                      value={thisBusinessCategories.Is_Active}
                      onChange={handleCheckboxChange}
                      checked={
                        thisBusinessCategories.Is_Active === "Y" ? true : false
                      }
                    />
                  }
                  label="Is Active"
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
