class Metadata {
  constructor(name, debug = false, testing = false) {
    this.name = name;
    this.debug = debug;
    this.testing = testing;
  }
}

module.exports = {
  Metadata,
};
