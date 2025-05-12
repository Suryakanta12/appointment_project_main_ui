/**
 * * Project Name : Appointment
 * * Layer Name : Database
 * * Section : LocationMaster Form
 * * Parent : Admin
 * Description : design LocationMaster form primary admin with Database
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
import IndianStatesAndDistricts from "../../../../CommonComponents/IndianStatesAndDistricts.json";
/** ------------------ Icons ----------------------------- */
import SaveIcon from "@mui/icons-material/Save";
/** ------------------ Media Imports --------------------- */
/** ------------------ Style Components ------------------ */
/** ------------------ API Declarations ------------------ */
/** ------------------ Third Party Components ------------ */

export default function LocationMasterForm(props) {
  /** ------------------ Props ------------------------- */
  const {
    thisLocationMaster,
    setThisLocationMaster,
    isEditMode,
    addLocationMaster,
    updateLocationMaster,
    processing,
    setProcessing,
  } = props;
  /** ------------------ Initial States -------------------- */
  /** ------------------ useStates ------------------------- */
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  /** ------------------ useEffects ------------------------ */
  useEffect(() => {
    const allStates = IndianStatesAndDistricts.states.map((item) => item.state);
    setStates(allStates);
  }, []);
  useEffect(() => {
    if (thisLocationMaster.Location_State_Name) {
      const stateData = IndianStatesAndDistricts.states.find(
        (item) => item.state === thisLocationMaster.Location_State_Name,
      );
      setDistricts(stateData ? stateData.districts : []);
    } else {
      setDistricts([]);
    }
  }, [thisLocationMaster.Location_State_Name]);
  /** ------------------ Functions & Events ---------------- */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setThisLocationMaster({ ...thisLocationMaster, [name]: value });
  };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    var ischecked = checked ? "Y" : "N";
    setThisLocationMaster({ ...thisLocationMaster, [name]: ischecked });
  };
  const handleSubmit = () => {
    setProcessing(true);
    isEditMode ? updateLocationMaster() : addLocationMaster();
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
                  label="Location Name"
                  fullWidth
                  variant="outlined"
                  name="Location_Name"
                  value={thisLocationMaster.Location_Name}
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
                  label="Location City Name"
                  fullWidth
                  variant="outlined"
                  name="Location_City_Name"
                  value={thisLocationMaster.Location_City_Name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  required
                  disabled
                  label="Location Country Name"
                  fullWidth
                  variant="outlined"
                  name="Location_Country_Name"
                  value={thisLocationMaster.Location_Country_Name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  select
                  fullWidth
                  label="State"
                  name="Location_State_Name"
                  value={thisLocationMaster.Location_State_Name}
                  onChange={handleInputChange}
                >
                  {states &&
                    states.length > 0 &&
                    states.map((state, si) => (
                      <MenuItem value={state} key={si}>
                        {state}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  select
                  fullWidth
                  label="City"
                  name="Location_Dist_Name"
                  value={thisLocationMaster.Location_Dist_Name}
                  onChange={handleInputChange}
                >
                  {districts &&
                    districts.length > 0 &&
                    districts.map((district, di) => (
                      <MenuItem value={district} key={di}>
                        {district}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  label="Descriptions"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  name="Location_Desc"
                  value={thisLocationMaster.Location_Desc}
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
                      value={thisLocationMaster.Is_Active}
                      onChange={handleCheckboxChange}
                      checked={
                        thisLocationMaster.Is_Active === "Y" ? true : false
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
