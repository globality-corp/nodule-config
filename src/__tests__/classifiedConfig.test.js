import { getInjector } from '../injector';
import { loadFromObject } from '../loaders';
import Nodule from '../nodule';


describe('Nodule Classified Config', () => {
    let nodule;

    beforeEach(async () => {
        nodule = Nodule.testing();
        await nodule.fromEnvironment(
        ).from(
            loadFromObject({
                foo: 'object',
            }),
            true,
        ).from(
            loadFromObject({
                bar: 'object',
            }),
        ).load();
    });

    it('classifies configuration', () => {
        const bottle = getInjector();
        const { container } = bottle;

        expect(container.config).toEqual({
            foo: 'object',
            bar: 'object',
        });

        expect(container.declassifiedConfig).toEqual({
            bar: 'object',
        });

    });
});
