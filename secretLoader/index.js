import Credstash from 'credstash';
import { parseIfShould } from "../booleanParser";

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
        const val = parseIfShould(secrets[key], parseBooleans);
        acc[key.toUpperCase()] = val;
        return acc;
      }, {});

      resolve(normSecrets);
    });
  } catch (e) {
    resolve({});
  }
});
