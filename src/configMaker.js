import { camelCase, merge, set } from 'lodash';


const SEPARATOR = '__';

function makeConfig(vars) {
    const configObjectsArray = [];

    Object.keys(vars).map((configKey) => {
        const assignPath = configKey.split(SEPARATOR).map(
            key => camelCase(key),
        ).join('.');

        const configObject = {};
        set(configObject, assignPath, vars[configKey]);

        configObjectsArray.push(configObject);
        return true;
    });

    return merge({}, ...configObjectsArray);
}


module.exports = {
    makeConfig,
};
