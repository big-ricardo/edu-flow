import jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not defined");
}

const sign = (payload: any) => jwt.sign(payload, secret, { expiresIn: "1d" });

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
};