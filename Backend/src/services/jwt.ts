import jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const secretResetPassword = process.env.JWT_RESET_PASSWORD_SECRET;

if (!secret || !secretResetPassword) {
  throw new Error("JWT_SECRET is not defined");
}

const sign = (payload: any, expiresIn = "1d") =>
  jwt.sign(payload, secret, { expiresIn });

const signResetPassword = (payload: any, expiresIn = "10m") =>
  jwt.sign(payload, secretResetPassword, { expiresIn });

const verifyResetPassword = (header: Object) => {
  const token = getTokenFromHeaders(header);
  const err = {
    status: 401,
    message: "Unauthorized",
  };

  if (!token) {
    throw err;
  }

  return jwt.verify(token, secretResetPassword, function (err, decoded) {
    if (err) throw err;

    return decoded;
  });
};

const verify = (header: Object) => {
  const token = getTokenFromHeaders(header);
  const err = {
    status: 401,
    message: "Unauthorized",
  };

  if (!token) {
    throw err;
  }

  return jwt.verify(token, secret, function (err, decoded) {
    if (err) throw err;

    return decoded;
  });
};

const decode = (token: string) => jwt.decode(token);

const getTokenFromHeaders = (headers: Object) => {
  const authHeader = headers["authorization"] || headers["Authorization"];
  if (!authHeader) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  return token;
};

export default {
  sign,
  verify,
  decode,
  signResetPassword,
  verifyResetPassword,
};
