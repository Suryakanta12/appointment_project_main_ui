var CryptoJS = require("crypto-js");
const APPSECRET = process.env.APPSECRET;

export const encryptText = (text) => {
  var cipherText = CryptoJS.AES.encrypt(text, APPSECRET).toString();
  return cipherText;
};
export const decryptText = (text) => {
  var decipherText = CryptoJS.AES.decrypt(text, APPSECRET);
  return decipherText.toString(CryptoJS.enc.Utf8);
};
