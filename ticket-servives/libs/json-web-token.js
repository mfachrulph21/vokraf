const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.JWTSECRETKEY;

const createHashPassword = (password) => bcrypt.hashSync(password);
const compareHashWithPassword = (password, hash) =>
  bcrypt.compareSync(password, hash);

const signPayloadToToken = (payload) => jwt.sign(payload, secretKey);
const verifyTokenToPayload = (token) => jwt.verify(token, secretKey);

module.exports = {
  createHashPassword,
  compareHashWithPassword,
  signPayloadToToken,
  verifyTokenToPayload,
};
