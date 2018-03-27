import { getDefaults, getInjector } from './injector';


export function bind(name, factory, scope = null) {
    const bottle = getInjector(scope);

    if (!bottle.providerMap[name]) {
        bottle.factory(name, factory);
    }
}


function initDefaults() {
    return {};
}


export function setDefaults(name, object, scope = null) {
    bind('defaults', initDefaults);

    const defaults = getDefaults(scope);
    defaults[name] = object;
}
