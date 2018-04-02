import { merge } from 'lodash';

import Credstash from 'credstash';

import { CREDSTASH_PREFIX } from '../constants';
import toObject from './convert';


function parseVersion(semver, base = 1000) {
    const version = semver.split('.');

    if (version.length !== 3) {
        return false;
    }

    const major = ((base ** 3) * Number(version[0]));
    const minor = ((base ** 2) * Number(version[1]));
    const patch = ((base ** 1) * Number(version[2]));

    return String(major + minor + patch);
}


async function loadSecrets(table, semver) {
    const dynamoVersion = parseVersion(semver);
    console.log(`Loading from table ${table} with version ${dynamoVersion}`); // eslint-disable-line no-console

    const credstash = new Credstash({
        table,
    });

    const secrets = await new Promise((resolve, reject) => credstash.list({
        dynamoVersion,
    }, (error, values) => {
        if (error) {
            reject(error);
        }
        resolve(values);
    }));

    return Object.keys(secrets).reduce(
        (acc, key) => merge(acc, toObject(key, secrets[key])),
        {},
    );
}


export default async function loadFromCredstash(metadata) {
    if (metadata.testing) {
        // do not load from external sources during unit tests
        return {
        };
    }

    const version = process.env[`${CREDSTASH_PREFIX}_CONFIG_VERSION`];
    if (!version) {
        const message = `Must define environment variable: ${CREDSTASH_PREFIX}_CONFIG_VERSION`;

        if (!metadata.debug) {
            throw new Error(message);
        }

        // allow bypassing credstash during debug
        return {};
    }

    const environment = process.env[`${CREDSTASH_PREFIX}_ENVIRONMENT`];
    if (!environment) {
        const message = `Must define environment variable: ${CREDSTASH_PREFIX}_ENVIRONMENT`;

        if (!metadata.debug) {
            throw new Error(message);
        }

        // allow bypassing credstash during debug
        return {};
    }

    const table = `${environment}-${metadata.name}-config`;
    return loadSecrets(table, version);
}
