import _ from "lodash";

import { makeConfig } from '../configMaker';
import { getInjector } from '../graph';
import Credstash from '../secretLoader';
import { parseIfShould } from '../booleanParser';

class Loader {
  constructor(secretLoaderPrefix = "MICROCOSM", parseBooleans = true) {
    this.secretLoaderPrefix = secretLoaderPrefix;
    this.parseBooleans = parseBooleans;
  }

  appName = () => {
    const envNameValue = process.env.NAME;
    return envNameValue;
  };

  appNameRegex = () => {
    return new RegExp(`^${this.appName().toUpperCase()}__`, 'g');
  };

  loadFromEnviron = () => {
    return new Promise((resolve) => {
        const allKeys = this.all();

        return resolve(allKeys.reduce((res, key) => {
          const newKey = key.replace(this.appNameRegex(), "");
          const val = process.env[key];

          res[newKey] = parseIfShould(val, this.parseBooleans);

          return res;
        }, {}));
    });
  };

  loadSecrets = (getVars = Credstash) => {
      return new Promise((resolve, reject) => {
          if (this.shouldLoadSecrets()) {
            const version = process.env[`${this.secretLoaderPrefix}_CONFIG_VERSION`];
            const env = process.env[`${this.secretLoaderPrefix}_ENVIRONMENT`];
            const secretsTable = `${env}-${this.appName()}-config`;

            console.log(`Loading from table ${secretsTable} with version ${version}`) // eslint-disable-line

            getVars(version, secretsTable, this.parseBooleans).then((secrets) => {
              console.log(`Completed loading from table ${secretsTable}`) // eslint-disable-line
              resolve(secrets);
            }).catch((error) => {
              reject(`Error has occured fetching secrets: ${error}`);
            });
          } else {
            resolve({});
          }
      });
  };

  all = () => {
    const keys = Object.keys(process.env);

    return keys.reduce((res, key) => {
      const matches = key.match(this.appNameRegex());

      if (matches != null && matches.length > 0) {
        res.push(key);
      }

      return res;
    }, []);
  };

  shouldLoadSecrets = () => {
    const keys = Object.keys(process.env);

    return keys.some((key) => {
      const regexp = new RegExp(`^${this.secretLoaderPrefix}_`, 'g');
      const matches = key.match(regexp);
      return matches && matches.length > 0;
    });
  };
}


function loadFromEnvironment(loader) {
    const graph = getInjector();
    return loader.loadFromEnviron().then((environment) => {
        const config = makeConfig(environment);
        graph.container.loader.environment = config;
        return config;
    });
}


function loadFromCredstash(loader) {
    const graph = getInjector();
    return loader.loadSecrets().then((secrets) => {
        const config = makeConfig(secrets);
        graph.container.loader.secrets = config;
        return config;
    });
}

module.exports = {
  Loader,
  loadFromEnvironment,
  loadFromCredstash,
};
