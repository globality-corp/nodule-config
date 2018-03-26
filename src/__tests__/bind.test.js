import getInjector from '../injector';
import { bind, setDefaults } from '../bind';


describe('bind', () => {
    it('registers a factory', () => {
        const bottle = getInjector();
        const { container } = bottle;

        expect(bottle.providerMap.foo).toBeUndefined();
        expect(container.foo).toBe(undefined);

        const factory = () => 42;

        bind('foo', factory);

        expect(bottle.providerMap.foo).toBe(true);
        expect(container.foo).toBe(42);
    });
});


describe('setDefaults', () => {

    it('sets defaults', () => {
        const bottle = getInjector();
        const { container } = bottle;

        expect(container.defaults.foo).toBeUndefined();

        setDefaults('foo', { bar: 'baz' });
        expect(container.defaults.foo).toEqual({
            bar: 'baz',
        });
    });

    it('preserves latest call', () => {
        const bottle = getInjector();
        const { container } = bottle;

        setDefaults('foo', { bar: 'baz' });
        setDefaults('foo', { baz: 'bar' });
        expect(container.defaults.foo).toEqual({
            baz: 'bar',
        });
    });
});
