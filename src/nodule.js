import { bind } from './bind';
import { getContainer } from './injector';
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

        bind('metadata', () => this.metadata);
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
        const { defaults, metadata } = getContainer(this.scope);

        const loader = loadEach(
            loadFromObject(defaults),
            ...this.loaders,
        );
        return loader(metadata).then((config) => {
            // NB: will fail if Nodule is run twice in the same scope/bottle
            bind('config', () => config);
            return config;
        });
    }
}
