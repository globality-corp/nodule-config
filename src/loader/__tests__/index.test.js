import { Loader } from '../index';

const mockGraph = { container: { metadata: { testing: true } } };

beforeAll(() => {
    process.env.NAME = 'testname';
    process.env.TESTNAME__GROUP__VAR = 'X';
    process.env.TESTNAME__VAR = 'Y';
    process.env.TESTNAME__BOOL_VAR_FALSE = '0';
    process.env.TESTNAME__BOOL_VAR_TRUE = '1';
    process.env.TESTNAME__BOOL_VAR_FALSE_LITERAL = 'False';
    process.env.TESTNAME__BOOL_VAR_TRUE_LITERAL = 'True';
    process.env.TESTNAME__BOOL_VAR_FALSE_LITERAL_D = 'false';
    process.env.TESTNAME__BOOL_VAR_TRUE_LITERAL_D = 'true';
});

test('Should have the correct length of keys', () => {
    const loader = new Loader(mockGraph);
    expect(loader.all().length).toBe(8);
});

describe('shouldLoadSecrets', () => {
    test('Loading secrets should be false', () => {
        process.env.MICROCOSM_ENV = 'dev';
        const loader = new Loader(mockGraph);
        expect(loader.shouldLoadSecrets()).toBe(true);
    });

    test('Loading secrets should be false', () => {
        delete process.env.MICROCOSM_ENV;
        const loader = new Loader(mockGraph);
        expect(loader.shouldLoadSecrets()).toBe(false);
    });
});

describe('loadFromEnviron', () => {
    test('Check that the object removes the application name from the env vars', () => {
        const loader = new Loader(mockGraph);
        loader.loadFromEnviron().then((obj) => {
            expect(obj.BOOL_VAR_FALSE_LITERAL).toBe(false); // We are parsing booleans by default
        });
    });

    test('Should have the correct number of keys', () => {
        const loader = new Loader(mockGraph);
        loader.loadFromEnviron().then((obj) => {
            const keys = Object.keys(obj);
            expect(keys.length).toBe(8);
        });
    });
});

describe('loadSecrets', () => {
    beforeEach(() => {
        process.env.MICROCOSM_ENVIRONMENT = 'dev';
        process.env.MICROCOSM_CONFIG_VERSION = '0.0.0';
    });

    afterEach(() => {
        delete process.env.MICROCOSM_ENV;
        delete process.env.MICROCOSM_CONFIG_VERSION;
    });

    test('Should load secrets', () => {
        const loader = new Loader(mockGraph);

        const getVars = jest.fn().mockImplementation((version, env) => {
            expect(env).toBe('dev-testname-config');
            expect(version).toBe('0.0.0');

            return new Promise((resolve) => {
                resolve({ SECRET_VAR: 'SECRET_VALUE' });
            });
        });

        return loader.loadSecrets(getVars).then((secrets) => {
            const keys = Object.keys(secrets);
            expect(keys.length).toBe(1);
        });
    });

    test('Should reject the entire function if the secrets had a problem fetching', () => {
        const loader = new Loader(mockGraph);

        const getVars = jest.fn().mockImplementation(
            () => new Promise(
                () => {
                    throw new Error('some error');
                },
            ),
        );

        return loader.loadSecrets(getVars).then(() => {
            // Make sure we never end up here
            expect(false).toBe(true);
        }).catch((error) => {
            expect(error).toBeTruthy();
        });
    });
});
