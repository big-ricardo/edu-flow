const dotenv = require("dotenv");
dotenv.config({ path: "../local.settings.json" });

const envs = {
  JWT_SECRET: "jest",
  MONGO_HOST: "host",
  MONGO_PORT: "27017",
  MONGO_USER: "jest",
  MONGO_PASS: "jest",
};

process.env = Object.assign(process.env, envs);
