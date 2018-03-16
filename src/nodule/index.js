import { get, merge, set } from "lodash";

import { getInjector } from '../graph';
import { Loader } from '../Loader';
import { makeConfig } from '../configMaker';
import { Metadata } from '../metadata';


function loadEnvironment(loader) {
    const graph = getInjector();
    return loader.loadFromEnviron().then((environment) => {
        const config = makeConfig(environment);
        graph.container.loader.environment = config;
        console.log("environ stuff??");
        console.log(config);
        return config;
    });
}


function loadCredstash(loader) {
    const graph = getInjector();
    return loader.loadSecrets().then((secrets) => {
        const config = makeConfig(secrets);
        graph.container.loader.secrets = config;
        return config;
    });
}


class Nodule {
    constructor(options) {
        this.graph = getInjector();
        this.options = options;
        this.name = this.options.name;
        this.debug = this.options.debug || false;
        this.testing = this.options.testing || false;
        
        const loaders = {};
        this.graph.factory('loader', () => loaders);

        const loader = new Loader();
        this.loaders = this.options.loaders || [loadEnvironment(loader), loadCredstash(loader)];
    }

    combined() {
        return Promise.all(this.loaders).then((configByLoader) => {
            return merge(...configByLoader);
        });
    }

    /* Build the full application configuration.
     */
    makeGraph() {
      const graph = getInjector();

      const metadata = new Metadata(
        this.name,
        this.debug,
        this.testing,
      );

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
}
