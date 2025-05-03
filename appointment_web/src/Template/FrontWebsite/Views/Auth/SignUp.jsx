import React, {
  useState,
  useContext,
  useEffect,
  use,
  useLayoutEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Link,
  Avatar,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  FormGroup,
  IconButton,
  InputAdornment,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Snackbar from "SnackBar/Snackbar.jsx";
import { postRecord, getRecord } from "services/services";
import { AuthContext } from "ContextOrRedux/AuthContext";
import IndianStatesAndDistricts from "../../../../CommonComponents/IndianStatesAndDistricts.json";
import {
  onlyPassword,
  onlyEmail,
  onlyNumbers,
  onlyPhoneNumber,
} from "CommonMethods/Validatations";
const API_Get_All_UserType = "api/v1/usertypes/all-usertypes";
const API_Register = "api/v1/authrouter/register";
const API_Add_Bussinessman = "/api/v1/businessmanuser/addbusinessmanusers";
const API_Get_All_Bussiness_Type = "api/v1/businesstype/allbusinesstypes";

export default function SignUp() {
  const initialState = {
    User_Type_Id: 0,
    Full_Name: "",
    Phone: "",
    Alt_Phone: "",
    Email: "",
    Password: "",
    Confirm_Password: "",
    Gender: "",
    State: "",
    City: "",
    Postal_Code: "",
    Address: "",
    Added_On: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  };
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const [thisRegistration, setThisRegistration] = useState(initialState);
  const [userTypes, setUserTypes] = useState([]);
  const [allBussinessType, setAllBussinessType] = useState([]);
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackOptions, setSnackOptions] = useState({
    color: "success",
    message: "Hi",
  });

  useEffect(() => {
    if (thisRegistration.Password === thisRegistration.Confirm_Password) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  }, [thisRegistration]);

  useEffect(() => {
    getRecord(API_Get_All_UserType, {})
      .then((response) => {
        if (response.status === "success") {
          var typeData = response.data.filter((item) => {
            return item.User_Type_Id !== 1;
          });
          setUserTypes(typeData);
        }
      })
      .catch((err) => {
        setSnackOptions({
          color: "error",
          message: err.response.data.detail,
        });
        setSnackOpen(true);
      });
  }, []);

  useEffect(() => {
    let componentMounted = true;
    getRecord(API_Get_All_Bussiness_Type, {})
      .then((response) => {
        console.log(response.data);
        if (response.status === "success") {
          setAllBussinessType(response.data);
        }
      })
      .catch((err) => {
        setSnackOptions({
          color: "error",
          message: err.response.data.detail,
        });
        setSnackOpen(true);
      });
    return () => {
      componentMounted = false;
    };
  }, []);

  useEffect(() => {
    const allStates = IndianStatesAndDistricts.states.map((item) => item.state);
    setStates(allStates);
  }, []);

  // Load districts whenever state changes
  useEffect(() => {
    if (thisRegistration.State) {
      const stateData = IndianStatesAndDistricts.states.find(
        (item) => item.state === thisRegistration.State,
      );
      setDistricts(stateData ? stateData.districts : []);
    } else {
      setDistricts([]);
    }
  }, [thisRegistration.State]);
  const handleSubmit = () => {
    console.log(thisRegistration);
    postRecord(API_Register, thisRegistration)
      .then((response) => {
        let result = response;
        if (result.status === "success") {
          setSnackOptions({
            color: result.color,
            message: result.message,
          });
          setSnackOpen(true);
          var contextData = {
            user: result.data.user_info,
            permissions: result.data.user_permission,
            token: result.data.access_token,
          };
          dispatch({ type: "LOGIN", payload: contextData });
          
          navigate(response.data.default_page);
          setThisRegistration(initialState);
        } else {
          setSnackOptions({
            color: "error",
            message: err.response.data.detail,
          });
          setSnackOpen(true);
        }

        setLoading(false);
      })
      .catch((err) => {
        setSnackOptions({
          color: "error",
          message: err.response.data.detail,
        });
        setSnackOpen(true);
        setLoading(false);
      });
  };
  const handleBusinessTypeChange = (event) => {
    const { value, checked } = event.target;
    setSelectedBusinessTypes((prev) =>
      checked ? [...prev, value] : prev.filter((type) => type !== value),
    );
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setThisRegistration({ ...thisRegistration, [name]: value });
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <React.Fragment>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url("https://img.freepik.com/premium-vector/technology-background-with-hitech-digital-data_29971-1134.jpg?w=1060")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed", // ✅ Keeps the background fixed while scrolling
          padding: 2,
        }}
      >
        <Box
          sx={{
            width: { xs: "90%", sm: "70%", md: "40%" },
            backgroundColor: "rgba(255, 255, 255)",
            borderRadius: 4,
            boxShadow: 5,
            padding: 4,
            backdropFilter: "blur(5px)",
          }}
        >
          {/* Logo Section */}
          <Box textAlign="center" mb={4}>
            <Avatar
              sx={{
                backgroundColor: "primary.main",
                width: 70,
                height: 70,
                margin: "0 auto",
              }}
            >
              <PersonAddAltIcon sx={{ fontSize: 36 }} />
            </Avatar>
            <Typography
              variant="h5"
              fontWeight="bold"
              mt={2}
              color="primary.main"
            >
              Create Your Account
            </Typography>
          </Box>

          {/* Form Fields */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!thisRegistration.User_Type_Id) {
                setSnackOptions({
                  color: "error",
                  message: "Please Select type",
                });
                setSnackOpen(true);
              } else if (!onlyPassword(thisRegistration.Password)) {
                setSnackOptions({
                  color: "error",
                  message:
                    "Password must contain at least 8 characters, one uppercase and one lowercase character, one number and a special character",
                });
                setSnackOpen(true);
              } else if (
                !onlyPassword(thisRegistration.Password) &&
                !onlyPassword(thisRegistration.Confirm_Password)
              ) {
                setSnackOptions({
                  color: "error",
                  message:
                    "This password did not match. Password must contain at least 8 characters, one uppercase and one lowercase character, one number and a special character",
                });
                setSnackOpen(true);
              } else {
                setLoading(true);
                handleSubmit();
              }
            }}
          >
            {/* Account Type Selection */}
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Select Type</FormLabel>
              <RadioGroup
                row
                required
                value={thisRegistration.User_Type_Id}
                name="User_Type_Id"
                onChange={handleInputChange}
              >
                {userTypes.map((type) => (
                  <FormControlLabel
                    value={type.User_Type_Id}
                    control={<Radio />}
                    key={type.User_Type_Id}
                    label={type.User_Type_Desc}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              margin="normal"
              required
              value={thisRegistration.Full_Name}
              onChange={handleInputChange}
              name="Full_Name"
            />
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              margin="normal"
              required
              value={thisRegistration.Phone}
              onChange={handleInputChange}
              name="Phone"
              onInput={(e) => onlyNumbers(e)}
            />
            <TextField
              fullWidth
              label="Alternate Phone Number"
              variant="outlined"
              margin="normal"
              value={thisRegistration.Alt_Phone}
              onChange={handleInputChange}
              name="Alt_Phone"
              onInput={(e) => onlyNumbers(e)}
            />
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              margin="normal"
              required
              value={thisRegistration.Email}
              onChange={handleInputChange}
              name="Email"
              type="email"
              onInput={(e) => onlyEmail(e)}
              helperText="Please enter a valid email address"
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              required
              value={thisRegistration.Password}
              onChange={handleInputChange}
              name="Password"
              type={showPassword ? "text" : "password"}
              onInput={(e) => onlyPassword(e)}
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
            />
            <TextField
              fullWidth
              label="Confirm Password"
              // type="password"
              variant="outlined"
              margin="normal"
              required
              type={showPassword ? "text" : "password"}
              value={thisRegistration.Confirm_Password}
              onChange={handleInputChange}
              name="Confirm_Password"
              onInput={(e) => onlyPassword(e)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      color={passwordMatch ? "success" : "error"}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Gender Selection */}
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                value={thisRegistration.Gender}
                name="Gender"
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            </FormControl>

            {/* Business Fields - Show only if Business is selected */}

            {thisRegistration &&
              Number(thisRegistration.User_Type_Id) === 2 && (
                <>
                  <TextField
                    fullWidth
                    label="Brand Name"
                    variant="outlined"
                    margin="normal"
                    required
                  />
                  <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <FormLabel component="legend">Business Type</FormLabel>
                    <FormGroup row>
                      {allBussinessType &&
                        allBussinessType.length > 0 &&
                        allBussinessType.map((type, i) => (
                          <FormControlLabel
                            key={i}
                            control={
                              <Checkbox
                                checked={selectedBusinessTypes.includes(
                                  type.Business_Type_Id,
                                )}
                                onChange={handleBusinessTypeChange}
                                value={type.Business_Type_Id}
                              />
                            }
                            label={type.Business_Type_Name}
                          />
                        ))}
                    </FormGroup>
                  </FormControl>
                  <TextField
                    select
                    fullWidth
                    label="State"
                    variant="outlined"
                    margin="normal"
                    required
                    name="State"
                    value={thisRegistration.State}
                    onChange={handleInputChange}
                  >
                    {states &&
                      states.length > 0 &&
                      states.map((state, i) => (
                        <MenuItem value={state} key={i}>
                          {state}
                        </MenuItem>
                      ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    label="District"
                    variant="outlined"
                    margin="normal"
                    required
                    name="City"
                    value={thisRegistration.City}
                    onChange={handleInputChange}
                  >
                    {districts &&
                      districts.length > 0 &&
                      districts.map((district, i) => (
                        <MenuItem value={district} key={states}>
                          {district}
                        </MenuItem>
                      ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="Pin Code"
                    variant="outlined"
                    margin="normal"
                    required
                    name="Postal_Code"
                    value={thisRegistration.Postal_Code}
                    onChange={handleInputChange}
                  />
                  <TextField
                    fullWidth
                    label="Address"
                    variant="outlined"
                    margin="normal"
                    multiline
                    rows={2}
                    required
                    name="Address"
                    value={thisRegistration.Address}
                    onChange={handleInputChange}
                  />
                </>
              )}

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{ mt: 2 }}
            >
              Sign Up
            </Button>
          </form>

          {/* Login Redirect */}
          <Box textAlign="center" mt={3}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link
                onClick={() => navigate("/SignIn")}
                underline="hover"
                color="primary"
                sx={{ cursor: "pointer" }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={snackOpen}
        setOpen={setSnackOpen}
        options={snackOptions}
        // message={snackOptions.message}
      />
    </React.Fragment>
  );
}
