import { Bottle } from 'bottlejs';


export function getInjector(scope = null) {
    const key = scope || 'nodule';

    const bottle = Bottle.pop(key);

    if (!bottle.providerMap.defaults) {
        bottle.factory('defaults', () => ({}));
    }

    return bottle;
}

export function getContainer(scope = null) {
    const { container } = getInjector(scope);
    return container;
}

export function getConfig(scope = null) {
    const { config } = getContainer(scope);
    return config;
}

export function getDefaults(scope = null) {
    const { defaults } = getContainer(scope);
    return defaults;
}

export function getMetadata(scope = null) {
    const { metadata } = getContainer(scope);
    return metadata;
}
