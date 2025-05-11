/**
 * * Project Name : Appointment
 * * Layer Name : Database
 * * Section : LocationActivePincode Form
 * * Parent : Admin
 * Description : design LocationActivePincode form primary admin with Database
 * Author: Suryakanta sahu
 * Date Created: 10-May-2025
 *
 *
 *
 *
 *
 */
/** --------------------- Primary Import Declaration ------------- */
import React, { useState, useEffect } from "react";
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

export default function LocationActivePincodeForm(props) {
  /** ------------------ Props ------------------------- */
  const {
    thisLocationActivePincode,
    setThisLocationActivePincode,
    isEditMode,
    addLocationActivePincode,
    updateLocationActivePincode,
    processing,
    setProcessing,
  } = props;
  /** ------------------ Initial States -------------------- */
  /** ------------------ useStates ------------------------- */
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  /** ------------------ useEffects ------------------------ */
  /** ------------------ Functions & Events ---------------- */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setThisLocationActivePincode({ ...thisLocationActivePincode, [name]: value });
  };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    var ischecked = checked ? "Y" : "N";
    setThisLocationActivePincode({ ...thisLocationActivePincode, [name]: ischecked });
  };
  const handleSubmit = () => {
    setProcessing(true);
    isEditMode ? updateLocationActivePincode() : addLocationActivePincode();
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
                  label="Pincode"
                  fullWidth
                  variant="outlined"
                  name="Pincode"
                  value={thisLocationActivePincode.Pincode}
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
                  label="Location Id"
                  fullWidth
                  variant="outlined"
                  name="Location_Id"
                  value={thisLocationActivePincode.Location_Id}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  required
                  label="Location Status"
                  fullWidth
                  variant="outlined"
                  name="Location_Status"
                  value={thisLocationActivePincode.Location_Status}
                  onChange={handleInputChange}
                />
              </Grid>


              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="Is_Active"
                      value={thisLocationActivePincode.Is_Active}
                      onChange={handleCheckboxChange}
                      checked={
                        thisLocationActivePincode.Is_Active === "Y"
                          ? true
                          : false
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
