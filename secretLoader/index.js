import Credstash from 'credstash';
import { parse } from "../booleanParser";

module.exports = (version, env, parseBooleans = true) => new Promise((resolve, reject) => {
  try {
    const cs = new Credstash({
      table: env,
    });

    cs.list({ version }, (e, secrets) => {
      if (e) {
        reject(e);
        return;
      }

      const normSecrets = Object.keys(secrets).reduce((acc, key) => {

        if (this.parseBooleans) {
          acc[key.toUpperCase()] = parse(secrets[key]); // eslint-disable-line no-param-reassign
        } else {
          acc[key.toUpperCase()] = secrets[key]; // eslint-disable-line no-param-reassign
        }

        return acc;
      }, {});

      resolve(normSecrets);
    });
  } catch (e) {
    resolve({});
  }
});
