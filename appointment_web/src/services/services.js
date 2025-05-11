import axios from "axios";
const APIURL = process.env.APIURL;
const APPSECRET = process.env.APPSECRET;
const headers = {
  "Content-Type": "application/json; charset=utf-8",
  // "Content-Type": "application/json",
};
const fomrHeader = { "Content-Type": "multipart/form-data" };

export const postRecord = (url, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${APIURL}${url}`, data, {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          "security-key": APPSECRET,
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        console.error("API POST error:", err.response?.data || err.message);
        reject(err);
      });
  });
};
export const authPostRecord = (url, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${APIURL}${url}`, data, {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          "secret-key": APPSECRET,
        },
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        console.error("API POST error:", err.response?.data || err.message);
        reject(err);
      });
  });
};
// export const postRecord = (url, data) => {
//   data.SECRET_KEY = APPSECRET;
//   return new Promise((resolve, reject) => {
//     console.log("Data", data);
//     console.log("URL", APIURL + url);
//     console.log("Header", headers);

//     axios
//       .post(APIURL + url, data, {
//         headers,
//       })
//       .then((res) => {
//         console.log("Response", res);
//         resolve(res);
//       })
//       .catch((err) => reject(err));
//   });
// };
export const uploadRecord = (url, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(APIURL + url, data, {
        fomrHeader,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

export const handleResponse = (response) => {
  if (response.status === 200 && response.data) {
    if (response.data.result) {
      let result = JSON.parse(response.data.result);
      return {
        statusText: "OK",
        color: result.Color,
        message: result.Message,
      };
    } else if (response.data == "Unauthorized Access") {
      return {
        statusText: "ERROR",
        color: "error",
        message: "Unauthorized Access",
      };
    } else if (response.data.errno) {
      return {
        statusText: "ERROR",
        color: "error",
        message:
          "Error: " + response.data.errno + ": " + response.data.sqlMessage,
      };
    } else {
      return {
        statusText: "ERROR",
        color: "error",
        message: "Error: Something happened. Report to Admin",
      };
    }
  } else {
    return {
      statusText: "UNKNOWN",
      color: "error",
      message:
        "Error:" + response.message + " Something happened. Report to Admin",
    };
  }
};

export const getRecord = async (url) => {
  try {
    const response = await axios.get(`${APIURL}${url}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "security-key": APPSECRET, // ✅ Must match FastAPI expectation
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// export const getRecord = (url) => {
//   return new Promise((resolve, reject) => {
//     console.log("URL", APIURL + url);
//     console.log("Header", headers);
//     console.log("Secret Key", APPSECRET);
//     axios
//       .get(`${APIURL}${url}`, {
//         headers: {
//           "Content-Type": "application/json",
//           accept: "application/json",
//           "secret-key": APPSECRET,
//         },
//       })
//       .then((res) => {
//         console.log("Response", res);
//         resolve(res);
//       })
//       .catch((err) => reject(err));
//   });
// };
export const putRecord = (url, data) => {
  data.SECRET_KEY = APPSECRET;
  return new Promise((resolve, reject) => {
    axios
      .put(APIURL + url, data, {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          "security-key": APPSECRET,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};
// export const deleteRecord = (url, data) => {
//   data.SECRET_KEY = APPSECRET;
//   return new Promise((resolve, reject) => {
//     axios
//       .delete(APIURL + url, {
//         headers,
//         data: data,
//       })
//       .then((res) => {
//         resolve(res);
//       })
//       .catch((err) => reject(err));
//   });
// };
export const deleteRecord = (url) => {
  return axios
    .delete(`${APIURL}${url}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "security-key": APPSECRET,
      },
    })
    .then((response) => {
      return response.data; // Return parsed JSON response
    })
    .catch((error) => {
      console.error("Delete API error:", error);
      return { status: "error", message: "Network error" };
    });
};
export const getRecordById = (url, id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(APIURL + url + "/" + id, {
        headers,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};
export const getRecordByIdWithParams = (url, id, params) => {
  return new Promise((resolve, reject) => {
    axios
      .get(APIURL + url + "/" + id, {
        headers,
        params: params,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};
export const getRecordByParams = (url, params) => {
  return new Promise((resolve, reject) => {
    axios
      .get(APIURL + url, {
        headers,
        params: params,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};
export const getRecordByParamsWithOutAuth = (url, params) => {
  return new Promise((resolve, reject) => {
    axios
      .get(APIURL + url, {
        params: params,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};
export const getRecordByParamsWithOutAuthAndHeader = (url, params) => {
  return new Promise((resolve, reject) => {
    axios
      .get(APIURL + url, {
        headers,
        params: params,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};
export const getRecordByParamsWithOutAuthAndHeaderWithOutUrl = (params) => {
  return new Promise((resolve, reject) => {
    axios
      .get(APIURL, {
        headers,
        params: params,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};
export const getRecordByParamsWithOutAuthAndHeaderWithOutUrlAndData = (
  params,
  data,
) => {
  return new Promise((resolve, reject) => {
    axios
      .get(APIURL, {
        headers,
        params: params,
        data: data,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};
// export const postMultipleRecords = async (url, recordsArray, delayMs = 300) => {
//   if (!Array.isArray(recordsArray)) {
//     console.error("Expected array but got:", typeof recordsArray, recordsArray);
//     throw new TypeError("recordsArray must be an array");
//   }

//   const results = [];
//   const delay = (ms) => new Promise((res) => setTimeout(res, ms));

//   for (const record of recordsArray) {
//     try {
//       const response = await axios.post(`${APIURL}${url}`, record, {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           "security-key": APPSECRET, // ✅ Must match FastAPI expectation
//         },
//       });
//       results.push({ status: "success", data: response.data });
//     } catch (error) {
//       console.error(
//         "Error submitting record:",
//         error.response?.data || error.message,
//       );
//       results.push({
//         status: "error",
//         error: error.response?.data || error.message,
//         record,
//       });
//     }

//     if (delayMs > 0) await delay(delayMs);
//   }

//   return results;
// };

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const postMultipleRecords = async (url, dataArray, token = "") => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "security-key": APPSECRET,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.post(`${APIURL}${url}`, dataArray, {
      headers,
    });
    return { status: "success", data: response.data };
  } catch (error) {
    return {
      status: "error",
      error: error.response?.data?.detail || error.message,
    };
  }
};
