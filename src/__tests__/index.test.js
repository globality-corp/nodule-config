import { Bottle } from 'bottlejs';
import { get } from 'lodash';

import {
    bind,
    getInjector,
    loadFromObject,
    Metadata,
    Nodule,
    setDefaults,
} from '..';


describe('api', () => {

    beforeEach(() => {
        Bottle.clear();

        setDefaults('foo', { value: 42 });

        // NB: we only reference defaults here to enable the first (non-standard) test case
        bind('foo', container => get(container, 'config.foo.value') || get(container, 'defaults.foo.value'));
    });

    it('registers defaults and factories', async () => {
        const bottle = getInjector();
        const { container } = bottle;

        expect(container.foo).toBe(42);
    });

    it('all works together', async () => {
        const bottle = getInjector();
        const { container } = bottle;

        const nodule = new Nodule(
            new Metadata({
                name: test,
                testing: true,
            }),
        );

        const config = await nodule.from(
            loadFromObject({
                foo: {
                    value: 88,
                },
            }),
        ).load();

        expect(config.foo.value).toBe(88);
        expect(container.foo).toBe(88);
    });
});
