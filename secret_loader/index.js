import Credstash from 'credstash';

module.exports = (version, env) => new Promise((resolve, reject) => {
    try {
        const cs = new Credstash({
            table: env,
        });

        cs.list({ version }, (e, secrets) => {
            if (e) {
                reject(e);
                return;
            }

            const normSecrets = Object.keys(secrets).reduce((acc, key) => {
                acc[key.toUpperCase()] = secrets[key]; // eslint-disable-line no-param-reassign
                return acc;
            }, {});

            resolve(normSecrets);
        });
    } catch (e) {
        resolve({});
    }
});
