import { Nodule } from '../index';


describe('Nodule', () => {
    beforeEach(() => {
        // enables secret loading to test both default loaders fire
        process.env.NAME = 'testname';
        process.env.MICROCOSM_ENVIRONMENT = 'dev';
        process.env.MICROCOSM_CONFIG_VERSION = '0.0.0';
        process.env.TESTNAME__GROUP__VAR = 'X';
    });

    afterEach(() => {
        delete process.env.MICROCOSM_ENV;
        delete process.env.MICROCOSM_ENVIRONMENT;
        delete process.env.MICROCOSM_CONFIG_VERSION;
        delete process.env.TESTNAME__GROUP__VAR;
    });

    test.skip('A Nodule combines config from all loaders', () => {
        const nodule = new Nodule({
            name: 'test',
            debug: true,
            testing: true,
        });
        return nodule.combined().then((config) => {
            expect(config).toEqual({
                group: { var: 'X' }, // from environment
                secretVar: 'dev-testname-config', // from 'credstash'
            });
        });
    });

    test('Can build a graph with metadata and config', () => {
        const nodule = new Nodule({
            name: 'test',
            debug: true,
            testing: true,
        });
        return nodule.makeGraph().then((graph) => {
            expect(graph.container.metadata.name).toBe('test');
            expect(graph.container.config).toBeTruthy();
        });
    });
});
