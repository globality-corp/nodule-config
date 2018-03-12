import { get, merge, set } from "lodash";
import { camelCase } from "./helpers";

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

/* Build configuration by merging defaults sections.
 */
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
const buildConfig = (defaults, vars) => {
    const injector = getInjector();

    // load environment variables
    const environ = makeConfig(vars);

    // generate metadata
    const metadata = {
        environment: get(environ, 'environment', 'dev'),
        ip: get(environ, 'ip', '0.0.0.0'),
        port: Number(get(environ, 'port', 3006)),
    };

    const config = merge(
        // generate configuration defaults (using metadata)
        mergeConfigSections(metadata, defaults),
        // override with environment settings
        environ,
    );

    // save config and return
    injector.factory('config', () => config);
    return config;
};

module.exports = {
    buildConfig,
};
