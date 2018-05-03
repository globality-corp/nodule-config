import AWS from 'aws-sdk-mock';

import loadFromSecretsManager from '../secretsManager';
import Metadata from '../../metadata';


describe('loadFromSecretsManager', () => {
    it('does not call the AWS client when microcosm config is not present', async () => {
        const getSecretSpy = jest.fn();
        AWS.mock('SecretsManager', 'getSecretValue', getSecretSpy);

        const metadata = new Metadata({
            name: 'test',
            testing: true,
            debug: true,
        });
        const config = await loadFromSecretsManager(metadata);

        expect(config).toEqual({
        });

        expect(getSecretSpy).not.toHaveBeenCalled();
        AWS.restore('SecretsManager');
    });

    it('calls the AWS client when microcosm config not present', async () => {
        process.env.MICROCOSM_CONFIG_VERSION = '1.0.0';
        process.env.MICROCOSM_ENVIRONMENT = 'whatever';

        AWS.mock('SecretsManager', 'getSecretValue', (params, callback) => {
            callback(null, {
                SecretString: '{"test": true}',
            });
        });

        const metadata = new Metadata({
            name: 'test',
            testing: true,
            debug: true,
        });
        const config = await loadFromSecretsManager(metadata);

        expect(config).toEqual({ test: true });

        AWS.restore('SecretsManager');

        delete process.env.MICROCOSM_CONFIG_VERSION;
        delete process.env.MICROCOSM_ENVIRONMENT;
    });

    it('Converts booleans from the secret string', async () => {
        process.env.MICROCOSM_CONFIG_VERSION = '1.0.0';
        process.env.MICROCOSM_ENVIRONMENT = 'whatever';

        AWS.mock('SecretsManager', 'getSecretValue', (params, callback) => {
            callback(null, {
                SecretString: JSON.stringify(
                    {
                        postgres: {
                            password: 'xyz',
                            isDatabase: 'True',
                        },
                    },
                ),
            });
        });

        const metadata = new Metadata({
            name: 'test',
            testing: true,
            debug: true,
        });
        const config = await loadFromSecretsManager(metadata);

        expect(config.postgres.isDatabase).toEqual(true);

        AWS.restore('SecretsManager');

        delete process.env.MICROCOSM_CONFIG_VERSION;
        delete process.env.MICROCOSM_ENVIRONMENT;
    });


});

