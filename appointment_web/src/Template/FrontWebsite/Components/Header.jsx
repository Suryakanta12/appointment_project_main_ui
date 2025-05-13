import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Button,
  TextField,
  InputAdornment,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Switch,
  Tooltip,
  FormControlLabel,
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Collapse from "@mui/material/Collapse";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CloseIcon from "@mui/icons-material/Close";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeContext } from "ContextOrRedux/ThemeProvider.js";
import { AuthContext } from "ContextOrRedux/AuthContext";
import { authPostRecord } from "services/services";
import Snackbar from "SnackBar/Snackbar.jsx";
const API_Logout = "api/v1/authrouter/logout";
const pages = ["Home", "About", "Our Businesses", "News Room", "ContactUs"];
const settings = ["Profile", "Orders", "Logout"];

export default function Header() {
  const themeMode = useContext(ThemeContext);
  const darkMode = themeMode.state.darkMode;
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackOptions, setSnackOptions] = useState({
    color: "success",
    message: "Hi",
  });
  const openProfile = Boolean(anchorEl);
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
  const handleNavigation = (page) => {
    page === "Home" ? navigate("/") : navigate("/" + page);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleProfileOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    var tokenData = {
      token: context.state.token,
    };
    authPostRecord(API_Logout, tokenData)
      .then((response) => {
        if (response.status === "success") {
          setSnackOptions({
            color: response.color,
            message: response.message,
          });
          dispatch({ type: "LOGOUT" });
        } else {
          setSnackOptions({
            color: response.color,
            message: response.message,
          });
        }
        setSnackOpen(true);
      })
      .catch((err) => {
        setSnackOptions({
          color: "error",
          message: err.response.data.detail,
        });
        setSnackOpen(true);
      });
  };
  return (
    <AppBar
      position="stick"
      sx={{
        backgroundColor: darkMode ? "#1E1E2C" : "#ffffff",
        color: darkMode ? "#ffffff" : "#333",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderBottom: "2px solid",
        borderColor: darkMode ? "#444" : "#eee",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h5"
            component="a"
            href="#"
            sx={{
              fontWeight: "bold",
              color: darkMode ? "#FFA726" : "#FB8C00",
              textDecoration: "none",
              flexGrow: 1,
            }}
          >
            MyBrand
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleNavigation(page.replace(/\s+/g, ""))}
                sx={{
                  mx: 1,
                  color: darkMode ? "#fff" : "#333",
                  fontWeight: "500",
                  "&:hover": {
                    color: "#FFA726",
                  },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Dark/Light Mode Toggle */}
          {/* <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              <FormControlLabel
                control={
                  <Switch
                    icon={<Brightness7Icon />} // Light mode icon
                    checkedIcon={<Brightness4Icon />} // Dark mode icon
                    onClick={() => {
                      darkMode
                        ? themeMode.dispatch({ type: "LIGHTMODE" })
                        : themeMode.dispatch({ type: "DARKMODE" });
                    }}
                  />
                }
              />
            </Tooltip> */}
          <Box sx={{ mr: 2 }}>
            <Tooltip
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <IconButton
                color="inherit"
                onClick={() =>
                  themeMode.dispatch({
                    type: darkMode ? "LIGHTMODE" : "DARKMODE",
                  })
                }
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Box>

          {/* Sign In and Sign Up Buttons */}
          {context.state && context.state.isAuthenticated === false ? (
            <>
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate("/SignIn")}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/SignUp")}
                >
                  Sign Up
                </Button>
              </Box>
            </>
          ) : (
            <>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon color="primary" />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon color="primary" />
                </Badge>
              </IconButton>
              <Box sx={{ flexGrow: 0 }}>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={handleProfileOpen}
                  //   size="small"
                  //   sx={{ ml: 2 }}
                  //   aria-controls={openProfile ? 'account-menu' : undefined}
                  //   aria-expanded={openProfile ? 'true' : undefined}
                >
                  <AccountCircle color="primary" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={openProfile}
                  onClose={handleProfileClose}
                  onClick={handleProfileClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem
                    onClick={() =>
                      navigate(
                        context.state && context.state.isAuthenticated === true
                          ? context.state.usertype.Default_Page
                          : "",
                      )
                    }
                  >
                    <Avatar /> Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleProfileClose}>
                    <Avatar /> Profile
                  </MenuItem>

                  <Divider />
                  <MenuItem onClick={handleProfileClose}>
                    <ListItemIcon>
                      <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    Add another account
                  </MenuItem>
                  <MenuItem onClick={handleProfileClose}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </>
          )}

          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Drawer for Mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            background: darkMode ? "#333" : "#fff",
            height: "100%",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 1,
              background: darkMode ? "#444" : "#f5f5f5",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Menu
            </Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {pages.map((page) => (
              <ListItem
                button
                key={page}
                onClick={() => handleNavigation(page)}
              >
                <ListItemText primary={page} />
              </ListItem>
            ))}
            <Divider />
            <ListItem button>
              <Button variant="outlined" color="inherit" fullWidth>
                Sign In
              </Button>
            </ListItem>
            <ListItem button>
              <Button variant="contained" color="primary" fullWidth>
                Sign Up
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
