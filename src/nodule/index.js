import { get, merge } from "lodash";

import { getInjector } from '../graph';
import { Loader, loadFromEnvironment, loadFromCredstash } from '../loader';
import Metadata from '../metadata';


class Nodule {
  constructor(options) {
    this.graph = getInjector();
    this.options = options;
    this.name = this.options.name;
    this.debug = this.options.debug || false;
    this.testing = this.options.testing || false;
    this.loaders = this.options.loaders || [loadFromEnvironment, loadFromCredstash];

    // order here matters, loader setup requires graph metadata to be
    // configured
    const metadata = new Metadata(
      this.name,
      this.debug,
      this.testing,
    );
    if (!this.graph.container.metadata) {
      this.graph.factory('metadata', () => metadata);
    }

    const loaders = {};
    if (!this.graph.container.loader) {
      this.graph.factory('loader', () => loaders);
    }
    this.loader = new Loader(this.graph);
  }

  combined() {
    const loaders = this.loaders.map(loader => loader(this.loader));
    return Promise.all(loaders).then((configByLoader) => {
      return merge(...configByLoader);
    });
  }

  makeGraph() {
    const graph = getInjector();

    return this.combined().then((loadedConfig) => {
      const serverDefaults = {
        environment: get(loadedConfig, 'environment', 'dev'),
        ip: get(loadedConfig, 'ip', '0.0.0.0'),
        port: Number(get(loadedConfig, 'port', 3006)),
      };

      const config = merge(
        graph.container.defaults,
        serverDefaults,
        loadedConfig,
      );
      graph.factory('config', () => config);
      return graph;
    });
  }
}

module.exports = {
  Nodule,
};
