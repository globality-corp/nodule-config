import loadFromCredstash from '../credstash';
import Metadata from '../../metadata';


describe('loadFromCredstash', () => {
    it('does not load data when unit testing', async () => {
        process.env.MICROCOSM_CONFIG_VERSION = '1.0.0';
        process.env.MICROCOSM_ENVIRONMENT = 'whatever';

        const metadata = new Metadata({
            name: 'test',
            testing: true,
            debug: false,
        });
        const config = await loadFromCredstash(metadata);

        expect(config).toEqual({
        });

        delete process.env.MICROCOSM_CONFIG_VERSION;
        delete process.env.MICROCOSM_ENVIRONMENT;
    });

    it('does not load data when unconfigured in local development', async () => {
        const metadata = new Metadata({
            name: 'test',
            testing: false,
            debug: true,
        });
        const config = await loadFromCredstash(metadata);

        expect(config).toEqual({
        });
    });

    it('does not load data when partially in local development', async () => {
        process.env.MICROCOSM_CONFIG_VERSION = '1.0.0';

        const metadata = new Metadata({
            name: 'test',
            testing: false,
            debug: true,
        });
        const config = await loadFromCredstash(metadata);

        expect(config).toEqual({
        });

        delete process.env.MICROCOSM_CONFIG_VERSION;
    });
});
