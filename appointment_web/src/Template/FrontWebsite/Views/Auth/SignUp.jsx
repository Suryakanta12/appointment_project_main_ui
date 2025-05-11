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
import {
  authPostRecord,
  getRecord,
  postMultipleRecords,
  setAuthToken,
} from "services/services";
import { AuthContext } from "ContextOrRedux/AuthContext";
import IndianStatesAndDistricts from "../../../../CommonComponents/IndianStatesAndDistricts.json";
import {
  onlyPassword,
  onlyEmail,
  onlyNumbers,
  onlyPhoneNumber,
  isValidPincode,
} from "CommonMethods/Validatations";
const API_Get_All_UserType = "api/v1/usertypes/all-usertypes";
const API_Register = "api/v1/authrouter/register";
const API_Add_Bussinessman =
  "api/v1/businessmanuser/addmultiplebusinessmanusers";
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
    Brand_Name: "",
    Added_On: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  };
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const context = useContext(AuthContext);
  const [thisRegistration, setThisRegistration] = useState(initialState);
  const [userTypes, setUserTypes] = useState([]);
  const [allBussinessType, setAllBussinessType] = useState([]);
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
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
            return item.User_Type_Id !== 1 && item.Is_Active==='Y';
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

  // useEffect(() => {
  //   if (submitting) {
  //     console.log(context.state);
  //   }
  // }, [submitting, context.state]);

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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (submitting) return; // Prevent duplicate submit
      setSubmitting(true);

      // ✅ Step 1: Register User
      const response = await authPostRecord(API_Register, thisRegistration);
      // console.log("API Response:", response); // Log the full response for debugging

      if (response.status !== "success") {
        setSnackOptions({
          color: "error",
          message: response.error || "Registration failed",
        });
        setSnackOpen(true);
        return;
      }

      const result = response;

      // ✅ Set token for future API requests (if needed globally)
      const token = result.data?.access_token || "";
      setAuthToken(token);

      setSnackOptions({
        color: result.color,
        message: result.message,
      });
      setSnackOpen(true);

      // ✅ Save context safely
      const contextData = {
        user: result.data?.user_info || {},
        permissions: result.data?.user_permission || [],
        usertype: result.data?.user_type_data || {},
        token,
      };
      dispatch({ type: "LOGIN", payload: contextData });

      // ✅ If user type is 2, add business
      if (result.data.user_type_id === 2) {
        const userId = result.data?.user_id;
        const userTypeId = result.data?.user_type;
        const addedBy = userId;

        const businessPayload = selectedBusinessTypes.map((typeId) => {
          const businessTypeObj = allBussinessType.find(
            (x) => x.Business_Type_Id === typeId,
          );

          return {
            User_Id: userId,
            User_Type_Id: userTypeId,
            Business_Type_Id: typeId,
            Business_Type_Name: businessTypeObj?.Business_Type_Name || "",
            Brand_Name: thisRegistration.Brand_Name || "",
            Business_Code: "",
            Business_Status: "Pending",
            Bussiness_Logo: "",
            Bussiness_Banner: "",
            Bussiness_Description: "",
            Is_Active: "Y",
            Added_By: addedBy,
            Added_On: new Date().toISOString(),
          };
        });

        // ✅ Step 3: Submit Multiple Business Records
        const businessResponse = await postMultipleRecords(
          API_Add_Bussinessman,
          businessPayload,
          token,
        );

        if (businessResponse.status === "success") {
          console.log("Business added successfully");
        } else {
          console.error("Failed to add businesses", businessResponse.error);
        }
      }

      // ✅ Navigate after success
      navigate(result.data?.default_page || "/");
      setThisRegistration(initialState);
    } catch (err) {
      console.error("Unexpected error:", err);
      setSnackOptions({
        color: "error",
        message: err.message || "An unexpected error occurred",
      });
      setSnackOpen(true);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };
  // const handleSearch = () => {
  //   fetch(
  //     `https://api.postalpincode.in/pincode/${thisRegistration.Postal_Code}`,
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data[0].Status === "Success") {
  //         console.log(data[0].PostOffice);
  //         // setPostOffices(data[0].PostOffice);
  //         // setError("");
  //       } else {
  //         console.log("No records found.");
  //         // setPostOffices([]);
  //         // setError("No records found.");
  //       }
  //     })
  //     .catch(() => {
  //       console.log("An error occurred while fetching data.");
  //       // setPostOffices([]);
  //       // setError("An error occurred while fetching data.");
  //     });
  // };
  const handleBusinessTypeChange = (event) => {
    const id = parseInt(event.target.value); // or use `Number()` if preferred
    setSelectedBusinessTypes((prev) =>
      event.target.checked ? [...prev, id] : prev.filter((item) => item !== id),
    );
    // const { value, checked } = event.target;
    // console.log("value----------", checked);
    // setSelectedBusinessTypes((prev) =>
    //   checked ? [...prev, value] : prev.filter((type) => type !== value),
    // );
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "Postal_Code") {
      if (!/^\d{0,6}$/.test(value)) return; // Only allow up to 6 digits
    }
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
              inputProps={{
                maxLength: 10,
                inputMode: "numeric",
              }}
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
                    name="Brand_Name"
                    value={thisRegistration.Brand_Name}
                    onChange={handleInputChange}
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
                    inputProps={{
                      inputMode: "numeric", // shows number pad on mobile
                      pattern: "[0-9]*",
                      // type: "number",
                      maxLength: 6,
                    }}
                    // onInput={(e) => isValidPincode(e)}
                  />
                  {/* <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSearch}
                    // type="submit"
                    // disabled={loading}
                    // startIcon={loading ? <CircularProgress size={20} /> : null}
                    sx={{ mt: 2 }}
                  >
                    Search
                  </Button> */}
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
