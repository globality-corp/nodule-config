import { get, merge, set } from "lodash";
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

const mergeConfigSections = (metadata, sections) => {
  return Object.keys(sections).reduce(
    (acc, key) => {
      const section = {};
      section[key] = sections[key](metadata);
      return merge(acc, section);
    },
    metadata,
  );
};

/* Build the full application configuration.
 */
const buildConfig = (name, defaults, vars, debug = false, testing = false) => {
  const injector = getInjector();

  // load environment variables
  const metadata = new Metadata(
    name,
    debug,
    testing,
  );

  const configFromEnviron = makeConfig(vars);

  const environment = {
    environment: get(configFromEnviron, 'environment', 'dev'),
    ip: get(configFromEnviron, 'ip', '0.0.0.0'),
    port: Number(get(configFromEnviron, 'port', 3006)),
  };

  const config = merge(
      mergeConfigSections(environment, defaults),
      configFromEnviron,
  );
  config.metadata = metadata;

  // save config and return
  injector.factory('config', () => config);
  return config;
};

module.exports = {
  buildConfig,
  makeConfig,
  mergeConfigSections,
};
