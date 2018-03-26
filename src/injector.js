import { Bottle } from 'bottlejs';


export default function getInjector(scope = null) {
    const key = scope || 'nodule';

    const bottle = Bottle.pop(key);

    if (!bottle.providerMap.defaults) {
        bottle.factory('defaults', () => ({}));
    }

    return bottle;
}
