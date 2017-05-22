'use strict';


const appName = () => {
  return process.env.NAME;
}

const all = () => {
  const keys = Object.keys(process.env);

  return keys.reduce((res, key) => {
    let regexp = new RegExp(`^${appName()}__`, 'g');
    let matches = key.match(regexp);

    if (matches != null && matches.length > 0) {
      res.push(key);
    }

    return res;

  }, []);

  return keys;
}

module.exports = {
  all
}
