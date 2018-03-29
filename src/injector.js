import { Bottle } from 'bottlejs';
import { get, unset } from 'lodash';

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

export function getConfig(target, scope) {
    const config = getContainer('config', scope);
    if (target) {
        return get(config, target);
    }
    return config;
}

export function getDefaults(scope) {
    return getContainer('defaults', scope);
}

export function getMetadata(scope) {
    return getContainer('metadata', scope);
}

/* Clear references to a specific named binding.
 */
export function clearBinding(name, scope) {
    const bottle = getInjector(scope);
    unset(bottle.providerMap, name);
    unset(bottle.container, name);
    unset(bottle.container, `${name}Provider`);
}

/* Reset a specific binding.
 */
export function resetBinding(name, scope) {
    clearBinding(name, scope);
    const bottle = getInjector(scope);
    bottle.provider(name, bottle.originalFactory[name]);
}
