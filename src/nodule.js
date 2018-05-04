import { bind } from './bind';
import { DEFAULT_SCOPE } from './constants';
import { getContainer } from './injector';
import {
    loadEach,
    loadFromSecretsManager,
    loadFromEnvironment,
    loadFromObject,
} from './loaders';
import Metadata from './metadata';


export default class Nodule {

    constructor(metadata, loaders = null, scope = DEFAULT_SCOPE) {
        this.metadata = new Metadata(metadata);
        this.loaders = loaders || [];
        this.scope = scope;

        bind('metadata', () => this.metadata);
    }

    from(value) {
        this.loaders.push(value);
        return this;
    }

    fromSecretsManager() {
        return this.from(loadFromSecretsManager);
    }

    fromEnvironment() {
        return this.from(loadFromEnvironment);
    }

    fromObject(obj) {
        return this.from(loadFromObject(obj));
    }

    load() {
        const { defaults, metadata } = getContainer(null, this.scope);

        const loader = loadEach(
            loadFromObject(defaults),
            ...this.loaders,
        );
        return loader(metadata).then((config) => {
            bind('config', () => config);
            return config;
        });
    }

    static testing(name = 'test') {
        return new Nodule({ name, testing: true });
    }
}
