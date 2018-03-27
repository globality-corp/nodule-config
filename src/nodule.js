import { getInjector } from './injector';
import {
    loadEach,
    loadFromCredstash,
    loadFromEnvironment,
    loadFromObject,
} from './loaders';
import Metadata from './metadata';


export default class Nodule {

    constructor(metadata, loaders = null, scope = null) {
        this.metadata = new Metadata(metadata);
        this.loaders = loaders || [];
        this.scope = scope;

        const bottle = getInjector(this.scope);

        if (!bottle.providerMap.metadata) {
            bottle.factory('metadata', () => this.metadata);
        }
    }

    from(value) {
        this.loaders.push(value);
        return this;
    }

    fromCredstash() {
        return this.from(loadFromCredstash);
    }

    fromEnvironment() {
        return this.from(loadFromEnvironment);
    }

    load() {
        const bottle = getInjector(this.scope);
        const { container } = bottle;

        const loader = loadEach(
            loadFromObject(container.defaults),
            ...this.loaders,
        );
        return loader(container.metadata).then((config) => {
            // NB: will fail if Nodule is run twice in the same scope/bottle
            bottle.factory('config', () => config);
            return config;
        });
    }
}
