import loadFromCredstash from '../credstash';
import Metadata from '../../metadata';


describe('loadFromCredstash', () => {
    it('does not load data when unit testing', async () => {
        const config = await loadFromCredstash(new Metadata('test', false, true));

        expect(config).toEqual({
        });
    });
});
