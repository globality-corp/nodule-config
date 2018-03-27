import { Bottle } from 'bottlejs';

import { DEFAULT_SCOPE } from './constants';


export function getInjector(scope = DEFAULT_SCOPE) {
    const key = scope || DEFAULT_SCOPE;

    const bottle = Bottle.pop(key);

    if (!bottle.providerMap.defaults) {
        bottle.factory('defaults', () => ({}));
    }

    return bottle;
}

export function getContainer(scope = DEFAULT_SCOPE) {
    const { container } = getInjector(scope);
    return container;
}

export function getConfig(scope = DEFAULT_SCOPE) {
    const { config } = getContainer(scope);
    return config;
}

export function getDefaults(scope = DEFAULT_SCOPE) {
    const { defaults } = getContainer(scope);
    return defaults;
}

export function getMetadata(scope = DEFAULT_SCOPE) {
    const { metadata } = getContainer(scope);
    return metadata;
}
