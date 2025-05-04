export const onlyNumbers = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
};
export const onlyDateTime = (e) => {
  e.target.value = e.target.value.replace(/[^]/g, "");
};
export const onlyEmail = (email) => {
  var pattern = new RegExp(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
  );
  return pattern.test(email);
};
export const onlyPassword = (password) => {
  var pattern = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
  );
  return pattern.test(password);
};
export const getNumberWithOrdinal = (n) => {
  var s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
export const onlyPhoneNumber = (phone) => {
  var pattern = new RegExp(/^[0-9]{10}$/);
  return pattern.test(phone);
};
export const onlyName = (name) => {
  var pattern = new RegExp(/^[a-zA-Z\s]+$/);
  return pattern.test(name);
};
export const onlyAlphanumeric = (text) => {
  var pattern = new RegExp(/^[a-zA-Z0-9\s]+$/);
  return pattern.test(text);
};

export const isValidPincode = (pincode) => {
  var pattern = new RegExp(/^[0-9]{6}$/); // Regex for exactly 6 digits
  return pattern.test(pincode);
};