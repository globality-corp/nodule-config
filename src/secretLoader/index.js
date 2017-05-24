import Credstash from 'credstash';
import { parseIfShould } from "../booleanParser";


const parseVersion = (semver, base = 1000) => {
  const version = semver.split('.');

  if (version.length !== 3) {
    return false;
  }

  const major = ((base ** 3) * Number(version[0]));
  const minor = ((base ** 2) * Number(version[1]));
  const patch = ((base ** 1) * Number(version[2]));

  return String(major + minor + patch);
};

module.exports = (version, env, parseBooleans = true) => new Promise((resolve, reject) => {
  try {
    const dynamoVersion = parseVersion(version);
    console.log(`Loading from table ${env} with version ${version}`) // eslint-disable-line

    const cs = new Credstash({
      table: env,
    });

    cs.list({ dynamoVersion }, (e, secrets) => {
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
