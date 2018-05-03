import AWS from 'aws-sdk';
import { merge } from 'lodash';

import { CREDSTASH_PREFIX } from '../constants';
import { convert } from './convert';


export function getClient() {
    return new AWS.SecretsManager();
}

function convertAllKeys(obj) {
    if (typeof obj !== 'object') return convert(obj);

    const newObj = {};

    Object.keys(obj).forEach((name) => {
        newObj[name] = convertAllKeys(obj[name]);
    });

    return newObj;
}

export default async function loadFromSecretsManager(metadata) {
    const version = process.env[`${CREDSTASH_PREFIX}_CONFIG_VERSION`];
    const environment = process.env[`${CREDSTASH_PREFIX}_ENVIRONMENT`];

    if (!version) {
        const message = `Must define environment variable: ${CREDSTASH_PREFIX}_CONFIG_VERSION`;

        if (!metadata.debug) {
            throw new Error(message);
        }

        // allow bypassing credstash during debug
        return {};
    }

    if (!environment) {
        const message = `Must define environment variable: ${CREDSTASH_PREFIX}_ENVIRONMENT`;

        if (!metadata.debug) {
            throw new Error(message);
        }

        // allow bypassing credstash during debug
        return {};
    }

    const secretId = `secrets/${environment}/${metadata.name}`;
    const client = getClient();

    const secrets = await new Promise((resolve, reject) => {
        client.getSecretValue({
            SecretId: secretId,
            VersionStage: version,
        }, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(convertAllKeys(JSON.parse(data.SecretString)));
        });
    });

    return secrets;
}
