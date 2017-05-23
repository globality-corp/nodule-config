import _ from "lodash";
import { camelCase } from "./helpers";

const SEPARATOR = "__";

const makeConfig = (vars) => {
  const configObjectsArray = [];

  Object.keys(vars).map((configKey) => {
    const assignPath = configKey.split(SEPARATOR).map((key) => {
      return camelCase(key);
    }).join(".");

    const configObject = {};
    _.set(configObject, assignPath, vars[configKey]);

    configObjectsArray.push(configObject);
    return true;
  });

  return _.merge({}, ...configObjectsArray);
};

module.exports = {
  makeConfig,
};
