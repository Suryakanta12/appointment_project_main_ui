import { encryptText, decryptText } from "commonmethods/Encryption.js";
import moment from "moment";
export function CheckRouteAccess(pathname) {
  let justPathname = "/" + pathname.split("/")[1];
  var accessbytes =
    localStorage.getItem("permissions") &&
    decryptText(localStorage.getItem("permissions"));
  var pageaccess = accessbytes && JSON.parse(accessbytes);
  // console.log(pageaccess)
  const checkAccess = pageaccess.filter(
    (x) => x.Page_Navigation_URL === justPathname,
  );
  if (checkAccess && checkAccess.length > 0) {
    return checkAccess[0];
  } else return false;
}
export const CheckModuleAccess = (module) => {
  var accessbytes =
    localStorage.getItem("permissions") &&
    decryptText(localStorage.getItem("permissions"));
  var pageaccess = accessbytes && JSON.parse(accessbytes);
  const checkAccess = pageaccess.filter(
    (x) => x.Page_Parent_Id === module.Page_Id,
  );
  if (checkAccess.length > 0) return true;
  else return false;
};
export function GenerateResetPasswordLink(user) {
  const nowDate = moment(new Date()).format("YYYY/MM/DD HH:mm");
  const conVal = user.Email_Id + "-" + user.User_Code + "-" + nowDate;
  const encval = encodeURIComponent(encryptText(conVal));
  const resetLink = process.env.SITEURL + "ResetPassword/" + encval;
  return resetLink;
}

export function DecodeResetLink(resetLink) {
  const uriDecode = decodeURIComponent(resetLink);
  const decipherText = decryptText(uriDecode);
  const usrData = decipherText.split("-");
  return usrData;
}
export function GenerateEmailVerificationLink(user) {
  const nowDate = moment(new Date()).format("YYYY/MM/DD HH:mm");
  const conVal = user.Email_Id + "-" + user.User_Code + "-" + nowDate;
  const encval = encodeURIComponent(encryptText(conVal));
  const resetLink = process.env.SITEURL + "VerifyEmail/" + encval;
  return resetLink;
}
export function DecodeEmailVerificationLink(verifyLink) {
  const uriDecode = decodeURIComponent(verifyLink);
  const decipherText = decryptText(uriDecode);
  const usrData = decipherText.split("-");
  return usrData;
}
