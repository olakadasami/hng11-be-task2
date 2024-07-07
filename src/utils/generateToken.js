const jwt = require("jsonwebtoken");

module.exports = async (payload, secret, expires) => {
  return await jwt.sign(payload, secret, {
    expiresIn: expires,
  });
};
