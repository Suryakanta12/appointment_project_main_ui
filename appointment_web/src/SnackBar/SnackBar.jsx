import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackBar(props) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      props.setOpen(false);
      return;
    }
    props.setOpen(false);
  };
  return (
    <React.Fragment>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={props.open}
          autoHideDuration={5000}
          onClose={handleClose}
          TransitionComponent={TransitionUp}
        >
          <Alert
            onClose={handleClose}
            severity={props.options.color}
            sx={{ width: "100%" }}
          >
            {props.options.message}
          </Alert>
        </Snackbar>
      </Stack>
    </React.Fragment>
  );
}
