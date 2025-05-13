import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  FormHelperText,
  Typography,
  Switch,
} from "@mui/material";
import {
  AccountCircle,
  Phone,
  Email,
  LocationOn,
  Link as LinkIcon,
  Business,
  Language,
  CalendarToday,
} from "@mui/icons-material";
import IndianStatesAndDistricts from "../../../../CommonComponents/IndianStatesAndDistricts.json";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  onlyNumbers,
  onlyDateTime,
  onlyEmail,
  onlyPassword,
} from "../../../../CommonMethods/Validatations";
export default function UsersForm(props) {
  const {
    thisUsers,
    setThisUsers,
    initialUserState,
    addUser,
    updateUser,
    isEditMode,
    setIsEditMode,
    processing,
    setProcessing,
    allUserTypes,
    setSnackOpen,
    setSnackOptions,
  } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "Postal_Code") {
      if (!/^\d{0,6}$/.test(value)) return; // Only allow up to 6 digits
    }
    setThisUsers((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      Modified_On: moment().format("YYYY-MM-DD HH:mm:ss"),
    }));
  };

  const handleSubmit = () => {
    setProcessing(true);
    if (isEditMode) {
      updateUser();
    } else {
      addUser();
    }
  };
  useEffect(() => {
    const allStates = IndianStatesAndDistricts.states.map((item) => item.state);
    setStates(allStates);
  }, []);
  useEffect(() => {
    if (thisUsers.State) {
      const stateData = IndianStatesAndDistricts.states.find(
        (item) => item.state === thisUsers.State,
      );
      setDistricts(stateData ? stateData.districts : []);
    } else {
      setDistricts([]);
    }
  }, [thisUsers.State]);

  useEffect(() => {
    if (!isEditMode) {
      setThisUsers(initialUserState);
    }
  }, [isEditMode]);

  const handleDOBDate = (newValue) => {
    setThisUsers({
      ...thisUsers,
      DOB: newValue,
    });
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <Box>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!onlyEmail(thisUsers.Email)) {
            setSnackOptions({
              color: "warning",
              message: "Please Enter Valid Email",
            });
            setSnackOpen(true);
          } else if (!onlyPassword(thisUsers.Password)) {
            setSnackOptions({
              color: "error",
              message:
                "Password must contain at least 8 characters, one uppercase and one lowercase character, one number and a special character",
            });
            setSnackOpen(true);
          } else {
            // setProcessing(true);
            thisUsers.DOB = moment(thisUsers.DOB).format("YYYY-MM-DD");
            handleSubmit();
          }
        }}
      >
        <Grid container spacing={2}>
          {/* Basic Info */}
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="Full_Name"
              value={thisUsers.Full_Name}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              disabled
              label="Email"
              name="Email"
              type="email"
              value={thisUsers.Email}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              disabled
              fullWidth
              required
              select
              label="User Type Id"
              type="number"
              name="User_Type_Id"
              value={thisUsers.User_Type_Id}
              onChange={handleChange}
            >
              {allUserTypes &&
                allUserTypes.length > 0 &&
                allUserTypes.map((userType) => (
                  <MenuItem
                    value={userType.User_Type_Id}
                    key={userType.User_Type_Id}
                  >
                    {userType.User_Type_Name}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>

          {/* Password */}
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="Password"
              name="Password"
              value={thisUsers.Password}
              onChange={handleChange}
              required
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <Box
              sx={{
                textAlign: "right",
                mb: 2,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="Phone"
              name="Phone"
              value={thisUsers.Phone}
              onChange={handleChange}
              onInput={(e) => onlyNumbers(e)}
              inputProps={{
                maxLength: 10,
                inputMode: "numeric",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="Alt Phone"
              name="Alt_Phone"
              value={thisUsers.Alt_Phone}
              onChange={handleChange}
              onInput={(e) => onlyNumbers(e)}
              inputProps={{
                maxLength: 10,
                inputMode: "numeric",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                name="Gender"
                value={thisUsers.Gender}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            {/* <TextField
              fullWidth
              label="DOB"
              type="date"
              name="DOB"
              InputLabelProps={{ shrink: true }}
              value={thisUsers.DOB?.substring(0, 10) || ""}
              onChange={handleChange}
            /> */}
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                // disabled={chemicalIndentEditMode}
                fullWidth
                label="DOB"
                inputFormat="YYYY-MM-DD"
                disableFuture
                name="DOB"
                value={thisUsers.DOB ? moment(thisUsers.DOB) : null}
                onChange={handleDOBDate}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    fullWidth
                    variant="outlined"
                    onInput={(e) => onlyDateTime(e)}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="Occupation"
              name="Occupation"
              value={thisUsers.Occupation}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="Company Name"
              name="Company_Name"
              value={thisUsers.Company_Name}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Additional Business Info */}
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="GST Number"
              name="GST_Number"
              value={thisUsers.GST_Number}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="Referral Code"
              name="Referral_Code"
              value={thisUsers.Referral_Code}
              onChange={handleChange}
            />
          </Grid>

          {/* Address Section */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="Address"
              value={thisUsers.Address}
              onChange={handleChange}
              multiline
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="State"
              name="State"
              value={thisUsers.State}
              onChange={handleChange}
            >
              {states &&
                states.length > 0 &&
                states.map((state, i) => (
                  <MenuItem value={state} key={i}>
                    {state}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="City"
              name="City"
              value={thisUsers.City}
              onChange={handleChange}
            >
              {districts &&
                districts.length > 0 &&
                districts.map((district, i) => (
                  <MenuItem value={district} key={states}>
                    {district}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              disabled
              fullWidth
              label="Country"
              name="Country"
              value={thisUsers.Country}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="Postal Code"
              name="Postal_Code"
              value={thisUsers.Postal_Code}
              onChange={handleChange}
              inputProps={{
                inputMode: "numeric", // shows number pad on mobile
                pattern: "[0-9]*",
                // type: "number",
                maxLength: 6,
              }}
            />
          </Grid>

          {/* Profile Info */}
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="Preferred Language"
              name="Preferred_Language"
              value={thisUsers.Preferred_Language}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="Profile Image URL"
              name="Profile_Image"
              value={thisUsers.Profile_Image}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="Background Image URL"
              name="Background_Image"
              value={thisUsers.Background_Image}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="Bio"
              value={thisUsers.Bio}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="Website"
              name="Website"
              value={thisUsers.Website}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="Social Links"
              name="Social_Links"
              value={thisUsers.Social_Links}
              onChange={handleChange}
            />
          </Grid>

          {/* Wallet Info */}
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="Wallet Balance"
              type="number"
              name="Wallet_Balance"
              value={thisUsers.Wallet_Balance}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="Currency"
              name="Currency"
              value={thisUsers.Currency}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="Last Transaction ID"
              name="Last_Transaction_Id"
              value={thisUsers.Last_Transaction_Id}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label="Payment Mode"
              name="Payment_Mode"
              value={thisUsers.Payment_Mode}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <FormControl>
              <Typography>Is Wallet Enabled</Typography>
              <Switch
                name="Is_Wallet_Enabled"
                checked={thisUsers.Is_Wallet_Enabled}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>

          {/* Submit */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={processing}
            >
              {isEditMode ? "Update User" : "Add User"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
