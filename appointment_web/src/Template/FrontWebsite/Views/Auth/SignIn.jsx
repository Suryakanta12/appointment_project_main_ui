import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Link,
  Avatar,
  IconButton,
  InputAdornment,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Snackbar from "SnackBar/Snackbar.jsx";
import { authPostRecord } from "services/services";
import { AuthContext } from "ContextOrRedux/AuthContext";
import { onlyPassword, onlyEmail } from "CommonMethods/Validatations";
const API_Login = "api/v1/authrouter/login";
export default function SignIn() {
  let navigate = useNavigate();
  const initialLoginState = {
    User_Email: "",
    User_Password: "",
  };
  // const { ErrorCode } = useParams();
  const { dispatch } = useContext(AuthContext);
  const [thisLogin, setThisLogin] = useState(initialLoginState);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackOptions, setSnackOptions] = useState({
    color: "success",
    message: "Hi",
  });
  /** ------------------ useEffects ------------------------ */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setThisLogin({ ...thisLogin, [name]: value });
  };
  const handleLoginRedirect = (user) => {
    navigate(user.Default_Page);
  };
  const handleSubmitLogin = () => {
    const loginObj = {
      Email: thisLogin.User_Email,
      Password: thisLogin.User_Password,
    };
    authPostRecord(API_Login, loginObj)
      .then((response) => {
        if (response.status === "success") {
          if (response) {
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
                usertype: result.data.user_type,
              };
              dispatch({ type: "LOGIN", payload: contextData });
              navigate(response.data.default_page);
            } else {
              setSnackOptions({
                color: result.color,
                message: result.message,
              });
              setSnackOpen(true);
            }
          } else {
            setSnackOptions({
              color: "error",
              message: response.data,
            });
            setSnackOpen(true);
          }
        } else {
          setSnackOptions({
            color: "error",
            message: response.statusText,
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
          <Box
            sx={{
              textAlign: "center",
              mb: 4,
            }}
          >
            <Avatar
              sx={{
                backgroundColor: "primary.main",
                width: 70,
                height: 70,
                margin: "0 auto",
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 36 }} />
            </Avatar>
            <Typography
              variant="h5"
              fontWeight="bold"
              mt={2}
              color="primary.main"
            >
              Welcome Back
            </Typography>
          </Box>

          {/* Form Section */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!onlyEmail(thisLogin.User_Email)) {
                setSnackOptions({
                  color: "warning",
                  message: "Please Enter Valid Email",
                });
                setSnackOpen(true);
              } else if (!onlyPassword(thisLogin.User_Password)) {
                setSnackOptions({
                  color: "error",
                  message:
                    "Password must contain at least 8 characters, one uppercase and one lowercase character, one number and a special character",
                });
                setSnackOpen(true);
              } else {
                setLoading(true);
                handleSubmitLogin();
              }
            }}
          >
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              margin="normal"
              required
              name="User_Email"
              onChange={handleInputChange}
              value={thisLogin.User_Email}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              // type="password"
              variant="outlined"
              margin="normal"
              required
              type={showPassword ? "text" : "password"}
              name="User_Password"
              onChange={handleInputChange}
              value={thisLogin.User_Password}
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
            >
              <Link href="#" underline="hover" color="primary">
                Forgot Password?
              </Link>
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                py: 1.5,
                fontSize: "1rem",
              }}
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              my: 3,
            }}
          >
            <Box
              sx={{ flexGrow: 1, height: "1px", backgroundColor: "#e0e0e0" }}
            />
            <Typography variant="body2" sx={{ px: 2, color: "grey.600" }}>
              OR
            </Typography>
            <Box
              sx={{ flexGrow: 1, height: "1px", backgroundColor: "#e0e0e0" }}
            />
          </Box>

          {/* Social Sign-In Buttons */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                size="large"
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                Sign in with Google
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                size="large"
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                Sign in with Facebook
              </Button>
            </Grid>
          </Grid>

          {/* Register Link */}
          <Box
            sx={{
              mt: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="grey.700">
              Don't have an account?{" "}
              <Link
                onClick={() => navigate("/SignUp")}
                underline="hover"
                color="primary"
                sx={{ cursor: "pointer" }}
              >
                Register here
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
