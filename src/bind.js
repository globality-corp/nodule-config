import { merge, set } from 'lodash';

import { DEFAULT_SCOPE } from './constants';
import { getDefaults, getInjector } from './injector';


export function bind(name, factory, scope = DEFAULT_SCOPE) {
    const bottle = getInjector(scope);

    if (!bottle.providerMap[name]) {
        bottle.factory(name, factory);
        return true;
    }

    return false;
}


function initDefaults() {
    return {};
}


export function setDefaults(name, object, scope = DEFAULT_SCOPE) {
    bind('defaults', initDefaults);

    const defaults = getDefaults(scope);
    const value = {};
    set(value, name, object);
    merge(defaults, value);
}
