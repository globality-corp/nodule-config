class Loader {
  constructor(secretLoaderPrefix = "MICROCOSM") {
    this.secretLoaderPrefix = secretLoaderPrefix;
  }

  appName = () => {
    const envNameValue = process.env.NAME;
    return envNameValue;
  };

  appNameRegex = () => {
    return new RegExp(`^${this.appName()}__`, 'g');
  }

  toStandardObject = () => {
    const allKeys = this.all();

    return allKeys.reduce((res, key) => {
      const newKey = key.replace(this.appNameRegex(), "");
      const val = process.env[key];
      res[newKey] = val;
      return res
    }, {});
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
