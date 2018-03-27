import loadFromCredstash from '../credstash';
import Metadata from '../../metadata';


describe('loadFromCredstash', () => {
    it('does not load data when unit testing', async () => {
        process.env.MICROCOSM_CONFIG_VERSION = '1.0.0';
        process.env.MICROCOSM_ENVIRONMENT = 'whatever';

        const config = await loadFromCredstash(new Metadata({
            name: 'test',
            testing: true,
        }));

        expect(config).toEqual({
        });
    });
});
