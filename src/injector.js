import { Bottle } from 'bottlejs';
import { get } from 'lodash';

import { DEFAULT_SCOPE } from './constants';


export function getInjector(scope) {
    const key = scope || DEFAULT_SCOPE;
    const bottle = Bottle.pop(key);

    if (!bottle.providerMap.defaults) {
        bottle.factory('defaults', () => ({}));
    }

    return bottle;
}

export function getContainer(target, scope) {
    const { container } = getInjector(scope);
    if (target) {
        return get(container, target);
    }
    return container;
}

export function getConfig(scope) {
    return getContainer('config', scope);
}

export function getDefaults(scope) {
    return getContainer('defaults', scope);
}

export function getMetadata(scope) {
    return getContainer('metadata', scope);
}
