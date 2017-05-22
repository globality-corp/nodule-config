class Loader {

  constructor(secretLoaderPrefix = "MICROCOSM") {
    this.secretPrefix = secretLoaderPrefix;
  }

  appName = () => {
    const envNameValue = process.env.NAME;
    return envNameValue;
  };

  all = () => {
    const keys = Object.keys(process.env);

    return keys.reduce((res, key) => {
      const regexp = new RegExp(`^${this.appName()}__`, 'g');
      const matches = key.match(regexp);

      if (matches != null && matches.length > 0) {
        res.push(key);
      }

      return res;

    }, []);
  };

  shouldLoadSecrets = () => {
    return this.all.some((key) => {
      const regexp = new RegExp(`^${this.secretLoaderPrefix()}__`, 'g');
      const matches = key.match(regexp);
      return matches && matches.length > 0;
    });
  };
}


module.exports = {
  Loader,
};
