import _ from "lodash";
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
    const name = this.appName();
    if (!name) {
      console.log("ENV var `NAME` is missing. Please make sure you define it")

      return null
    }
    return new RegExp(`^${this.appName().toUpperCase()}__`, 'g');
  }

  toStandardObject = () => {
    const allKeys = this.all();

    return allKeys.reduce((res, key) => {
      const newKey = key.replace(this.appNameRegex(), "");
      const val = process.env[key];

      res[newKey] = parseIfShould(val, this.parseBooleans);

      return res;
    }, {});
  }

  toCombinedObject = (getVars = Credstash) => {
    return new Promise((resolve, reject) => {
      const envObject = this.toStandardObject();

      if (this.shouldLoadSecrets()) {
        const version = process.env[`${this.secretLoaderPrefix}_CONFIG_VERSION`];
        const env = process.env[`${this.secretLoaderPrefix}_ENVIRONMENT`];
        const secretsTable = `${env}-${this.appName()}-config`;

        console.log(`Loading from table ${secretsTable} with version ${version}`) // eslint-disable-line

        getVars(version, secretsTable, this.parseBooleans).then((secrets) => {
          console.log(`Completed loading from table ${secretsTable}`) // eslint-disable-line
          // add the name to the config without the need to namespace it under the app name env var
          const combined = _.merge(envObject, secrets, { name: this.appName() });
          resolve(combined);
        }).catch((error) => {
          reject(`Error has occured fetching secrets: ${error}`);
        });
      } else {
        resolve(_.merge(envObject, { name: this.appName() }));
      }
    });
  }

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

module.exports = {
  Loader,
};
