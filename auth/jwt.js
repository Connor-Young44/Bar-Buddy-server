const jwt = require("jsonwebtoken");

const jwtSecret = "uisd8743dg£%dgsdgdsg%dsgsdgs886";

function toJwt(data) {
  return jwt.sign(data, jwtSecret, { expiresIn: "2h" });
}

function toData(token) {
  return jwt.verify(token, jwtSecret);
}

module.exports = { toJwt, toData };
