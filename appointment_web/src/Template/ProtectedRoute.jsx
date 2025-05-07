// import React from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";

// const ProtectedRoute = ({ isAllowed, redirectPath = "/SignIn", children }) => {
//   const location = useLocation();

//   if (!isAllowed) {
//     return <Navigate to={redirectPath} replace state={{ from: location }} />;
//   }

//   return children ? children : <Outlet />;
// };

// export default ProtectedRoute;

import React from "react";
import { Routes, Route, Link, Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({
  isAllowed,
  currentUser,
  redirectPath = "/SignIn",
  children,
}) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  } else {
    return children ? children : <Outlet />;
    // if (currentUser.User_Type_Id === 2)
    //   return <Navigate to={"/CustomErrors/" + 305} replace />;
    // else return children ? children : <Outlet />;
  }
};

export default ProtectedRoute;
