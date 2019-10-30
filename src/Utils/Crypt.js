import CryptoJS from "crypto-js";

const SECRET_KEY = "Dry@888";

export const encrypt = (data, secretKey = SECRET_KEY) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();

export const decrypt = (ciphertext, secretKey = SECRET_KEY) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export default {
  encrypt,
  decrypt
};
