const CryptoJS = require("crypto-js");
require("dotenv").config();

function encrypt(data) {
  const cipherText = CryptoJS.AES.encrypt(data, process.env.ENC_KEY).toString();
  return cipherText;
}

function decrypt(data) {
  try {
    const bytes = CryptoJS.AES.decrypt(data, process.env.ENC_KEY);

    if (bytes.sigBytes > 0) {
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedData;
    }
  } catch (error) {
    throw new Error("Decrypted failed");
  }
}

module.exports = {
  encrypt,
  decrypt,
};
