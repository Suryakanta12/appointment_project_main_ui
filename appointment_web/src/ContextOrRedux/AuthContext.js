import React, { createContext, useReducer } from "react";
import { encryptText, decryptText } from "commonmethods/Encryption.js";
export const AuthContext = createContext();

export const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      var cipherUser = encryptText(JSON.stringify(action.payload.user));
      localStorage.setItem("user", cipherUser);
      var cipheraccess = encryptText(
        JSON.stringify(action.payload.permissions),
      );
      localStorage.setItem("permissions", cipheraccess);
      var cipherUserType = encryptText(JSON.stringify(action.payload.usertype));
      localStorage.setItem("usertype", cipherUserType);
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        permissions: action.payload.permissions,
        usertype: action.payload.usertype,
        token: action.payload.token,
      };
    case "LOGOUT":
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
      localStorage.removeItem("usertype");
      localStorage.removeItem("token");
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        permissions: null,
        usertype:null,
        token: null,
      };
    
    default:
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
      localStorage.removeItem("usertype");
      localStorage.removeItem("token");
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        permissions: null,
        usertype: null,
        token: null,
      };
  }
};
