import { getInjector } from './injector';


export function bind(name, factory, scope = null) {
    const bottle = getInjector(scope);
    bottle.factory(name, factory);
}


export function setDefaults(name, object, scope = null) {
    const bottle = getInjector(scope);
    if (!bottle.providerMap.defaults) {
        bottle.factory('defaults', () => ({}));
    }
    const { container } = bottle;

    container.defaults[name] = object;
}
