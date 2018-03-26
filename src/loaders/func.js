import { merge } from 'lodash';


export function loadFromObject(object) {
    return () => object;
}


export function loadEach(...loaders) {
    return async (metadata) => {
        const resolved = await Promise.all(
            loaders.map(
                loader => loader(metadata),
            ),
        );
        return resolved.reduce(
            (acc, config) => merge(acc, config),
            {},
        );
    };
}
