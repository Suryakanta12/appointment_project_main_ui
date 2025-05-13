/**
 * * Project Name : Appointment
 * * Layer Name : Database
 * * Section : BussinessType Form
 * * Parent : Admin
 * Description : design BussinessType form primary admin with Database
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

export default function BussinessTypeForm(props) {
  /** ------------------ Props ------------------------- */
  const {
    thisBussinessType,
    setThisBussinessType,
    isEditMode,
    addUserType,
    updateUserType,
    processing,
    setProcessing,
  } = props;
  /** ------------------ Initial States -------------------- */
  /** ------------------ useStates ------------------------- */
  /** ------------------ useEffects ------------------------ */
  /** ------------------ Functions & Events ---------------- */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setThisBussinessType({ ...thisBussinessType, [name]: value });
  };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    var ischecked = checked ? "Y" : "N";
    setThisBussinessType({ ...thisBussinessType, [name]: ischecked });
  };
  const handleSubmit = () => {
    setProcessing(true);
    isEditMode ? updateUserType() : addUserType();
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
                  label="Business Type Name"
                  fullWidth
                  variant="outlined"
                  name="Business_Type_Name"
                  value={thisBussinessType.Business_Type_Name}
                  onChange={handleInputChange}
                  inputProps={{
                    maxLength: 50,
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
                  select
                  label="Business_Status"
                  fullWidth
                  variant="outlined"
                  name="Business_Status"
                  value={thisBussinessType.Business_Status}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Up Comming">Up Comming</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Block">Block</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  label="Descriptions"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  name="Business_Type_Desc"
                  value={thisBussinessType.Business_Type_Desc}
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
                      value={thisBussinessType.Is_Active}
                      onChange={handleCheckboxChange}
                      checked={
                        thisBussinessType.Is_Active === "Y" ? true : false
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
