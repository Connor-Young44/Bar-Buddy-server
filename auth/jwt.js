const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.jwtSecret;

function toJwt(data) {
  return jwt.sign(data, jwtSecret, { expiresIn: "10h" });
}

function toData(token) {
  return jwt.verify(token, jwtSecret);
}

module.exports = { toJwt, toData };
