/** Primary Import Declaration */
import React, {
  useEffect,
  useContext,
  useState,
  useReducer,
  useMemo,
} from "react";

/** MUI Themes */
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
/** App Route Component */
/** Theming and Styling */
import { darkTheme, lightTheme } from "theme.js";
import { ThemeContext } from "./ContextOrRedux/ThemeProvider.js";
import { AuthContext, reducer } from "./ContextOrRedux/AuthContext.js";
import { decryptText } from "commonmethods/Encryption.js";
import MainRoutes from "./Template/MainRoutes.jsx";
export default function App(props) {
  /** State and Reducer for Authentication Context */
  const initialState = {
    isAuthenticated: false,
    user: null,
    permissions: null,
    usertype: null,
    token: null,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);
  // const authContextValue = useMemo(() => ({ state, dispatch }), [state]);
  /** State and Reducer for Theme Context */
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const themeMode = useContext(ThemeContext);
  const darkMode = themeMode.state.darkMode;
  // useEffect(() => {
  //   prefersDarkMode
  //     ? themeMode.dispatch({ type: "DARKMODE" })
  //     : themeMode.dispatch({ type: "LIGHTMODE" });
  // }, [prefersDarkMode]);
  useEffect(() => {
    let componentMounted = true;
    if (prefersDarkMode && localStorage.getItem("darkMode") === "true") {
      themeMode.dispatch({ type: "DARKMODE" });
    } else {
      themeMode.dispatch({ type: "LIGHTMODE" });
    }
    verifyAuth();

    setLoading(false);
    return () => {
      componentMounted = false;
    };
  }, []);
  const verifyAuth = () => {
    var userbytes =
      localStorage.getItem("user") && decryptText(localStorage.getItem("user"));
    var user = JSON.parse(userbytes);
    var accessbytes =
      localStorage.getItem("permissions") &&
      decryptText(localStorage.getItem("permissions"));
    var permissions = accessbytes && JSON.parse(accessbytes);
    var usertypebytes =
      localStorage.getItem("usertype") &&
      decryptText(localStorage.getItem("usertype"));
    var usertype = JSON.parse(usertypebytes);
    var tokenbyte =
      localStorage.getItem("token") && localStorage.getItem("token");
    var token = tokenbyte;
    if (user && permissions && usertype && token) {
      dispatch({
        type: "LOGIN",
        payload: {
          user,
          permissions,
          token,
          usertype,
          // indentMode,
        },
      });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  };
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      {loading ? (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <AuthContext.Provider
          value={{
            state,
            dispatch,
          }}
        >
          <ThemeContext.Provider value={themeMode}>
            <CssBaseline />
            <MainRoutes />
            {/* {!loading && <MainRoutes />} */}
            {/* <MainApp verifyAuth={verifyAuth} /> */}
          </ThemeContext.Provider>
        </AuthContext.Provider>
      )}
      {/* <CssBaseline />
      <MainRoutes /> */}
    </ThemeProvider>
  );
}
