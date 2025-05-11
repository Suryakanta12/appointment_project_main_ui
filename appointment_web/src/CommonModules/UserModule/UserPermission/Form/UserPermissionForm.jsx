/**
 * * Project Name : eco presence
 * * Layer Name : Database
 * * Section : Permission Form
 * * Parent : Admin
 * Description : design Permission form primary admin with Database
 * Author: Suryakanta sahu
 * Date Created: 10-May-2022
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

export default function PermissionForm(props) {
  /** ------------------ Props ------------------------- */
  const {
    thisUserPermission,
    setThisUserPermission,
    isEditMode,
    allUserTypes,
    addUserPermission,
    updateUserPermission,
    allPages,
    setAllPages,
    processing,
    setProcessing,
  } = props;
  /** ------------------ Initial States -------------------- */
  /** ------------------ useStates ------------------------- */

  const [selectedModule, setSelectedModule] = useState(
    thisUserPermission.Module_Id,
  );
  /** ------------------ useEffects ------------------------ */
  // useEffect(() => {
  //   if (selectedModule !== "") {
  //     const filterData = allPages.filter(
  //       (x) => x.Page_Parent_Id === parseInt(selectedModule)
  //     );
  //     setFilterPages(filterData);
  //   }
  // }, [selectedModule]);
  /** ------------------ Functions & Events ---------------- */

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setThisUserPermission({ ...thisUserPermission, [name]: value });
  };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    var ischecked = checked ? "Y" : "N";
    setThisUserPermission({ ...thisUserPermission, [name]: ischecked });
  };
  const handleModuleChange = (event) => {
    const { name, value } = event.target;
    setSelectedModule(value);
  };
  const handleSubmit = () => {
    setProcessing(true);
    isEditMode ? updateUserPermission() : addUserPermission();
  };
  // console.log(thisUserPermission);
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
                  select
                  label="Select User Type"
                  fullWidth
                  variant="outlined"
                  name="User_Type_Id"
                  value={thisUserPermission.User_Type_Id}
                  onChange={handleInputChange}
                  sx={{ my: 1.5 }}
                >
                  {allUserTypes &&
                    allUserTypes.length > 0 &&
                    allUserTypes.map((usertype) => (
                      <MenuItem
                        value={usertype.User_Type_Id}
                        key={usertype.User_Type_Id}
                      >
                        {usertype.User_Type_Name}
                      </MenuItem>
                    ))}
                </TextField>

                <TextField
                  required
                  select
                  label="Select Module"
                  fullWidth
                  variant="outlined"
                  name="Selected_Module"
                  value={selectedModule}
                  onChange={handleModuleChange}
                  sx={{ my: 1.5 }}
                >
                  <MenuItem value="">Select Module</MenuItem>
                  {allPages &&
                    allPages.length > 0 &&
                    allPages
                      .filter(
                        (x) =>
                          x.Page_Parent_Id == 0 || x.Page_Parent_Id == null,
                      )
                      .map((Pages) => (
                        <MenuItem value={Pages.Page_Id} key={Pages.Page_Id}>
                          {Pages.Page_Name}
                        </MenuItem>
                      ))}
                </TextField>
                {selectedModule !== "" && (
                  <TextField
                    required
                    select
                    label="Select Pages"
                    fullWidth
                    variant="outlined"
                    name="Page_Id"
                    value={thisUserPermission.Page_Id}
                    onChange={handleInputChange}
                    sx={{ my: 1.5 }}
                    // disabled={selectedModule === 0 ? true : false}
                  >
                    {allPages &&
                      allPages.length > 0 &&
                      allPages
                        .filter(
                          (x) => x.Page_Parent_Id === parseInt(selectedModule),
                        )
                        .map((page) => (
                          <MenuItem value={page.Page_Id} key={page.Page_Id}>
                            {page.Page_Name}
                          </MenuItem>
                        ))}
                  </TextField>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    ml: 10,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        required
                        name="Can_View"
                        value={thisUserPermission.Can_View}
                        onChange={handleCheckboxChange}
                        checked={thisUserPermission.Can_View === "Y" ? true : false}
                      />
                    }
                    label="Can View *"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="Can_Create"
                        value={thisUserPermission.Can_Create}
                        onChange={handleCheckboxChange}
                        checked={
                          thisUserPermission.Can_Create === "Y" ? true : false
                        }
                      />
                    }
                    label="Can Create"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="Can_Update"
                        value={thisUserPermission.Can_Update}
                        onChange={handleCheckboxChange}
                        checked={
                          thisUserPermission.Can_Update === "Y" ? true : false
                        }
                      />
                    }
                    label="Can Update"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled
                        name="Can_Delete"
                        value={thisUserPermission.Can_Delete}
                        onChange={handleCheckboxChange}
                        checked={
                          thisUserPermission.Can_Delete === "Y" ? true : false
                        }
                      />
                    }
                    label="Can Delete"
                    labelPlacement="end"
                  />
                </Box>
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
