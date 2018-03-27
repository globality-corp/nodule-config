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
    const bottle = getInjector(scope);
    const { container } = bottle;
    return container;
}
