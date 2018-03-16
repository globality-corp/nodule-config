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

const mergeConfigSections = (metadata, defaults) => {
  return Object.keys(sections).reduce(
    (acc, key) => {
      const section = {};
      section[key] = sections[key](metadata);
      return merge(acc, section);
    },
    metadata,
  );
};


module.exports = {
  makeConfig,
  mergeConfigSections,
};
