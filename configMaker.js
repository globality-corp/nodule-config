import _ from "lodash";
import { camelCase } from "./helpers";

const SEPARATOR = "__";

const makeConfig = (vars) => {
  let configObjectsArray = [];

  Object.keys(vars).map((key) => {
    const assignPath = key.split(SEPARATOR).map((key) => {
      return camelCase(key);
    }).join(".");
    console.log(assignPath);

    let configObject = {};
    _.set(configObject, assignPath, vars[key]);

    configObjectsArray.push(configObject);
  });

  return _.merge({}, ...configObjectsArray);
}

module.exports = {
  makeConfig
}
