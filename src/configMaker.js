import { merge, set } from "lodash";
import { camelCase } from "./helpers";

import { getInjector } from './graph';
import { Metadata } from './metadata';

const SEPARATOR = "__";

const makeConfig = (vars) => {
  const configObjectsArray = [];

  Object.keys(vars).map((configKey) => {
    const assignPath = configKey.split(SEPARATOR).map((key) => {
      return camelCase(key);
    }).join(".");

    const configObject = {};
    set(configObject, assignPath, vars[configKey]);

    configObjectsArray.push(configObject);
    return true;
  });

  return merge({}, ...configObjectsArray);
};

/* Build the full application configuration.
 */
const buildConfig = (name, defaults, vars, debug = false, testing = false) => {
  const injector = getInjector();

  // load environment variables
  const environ = makeConfig(vars);

  // generate metadata
  const metadata = new Metadata(
    name,
    debug,
    testing,
  );

  const config = merge(defaults, environ);
  config.metadata = metadata;

  // save config and return
  injector.factory('config', () => config);
  return config;
};

module.exports = {
  buildConfig,
  makeConfig,
};
