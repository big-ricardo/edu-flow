import fs from "fs";
import path from "path";

const models = {};
const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter((file) => {
    return !file.startsWith(".") && file !== basename && file.endsWith(".js");
  })
  .forEach((file) => {
    console.log(`Loading model file ${file}`);
    const model = require(path.join(__dirname, file));
    const entityName = file.split(".")[0];
    models[entityName] = model[entityName];
  });

export default models;
