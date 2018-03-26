import { Bottle } from 'bottlejs';
import getInjector, { globalObject, INJECTOR_KEY } from '../getInjector';

describe('getInjector', () => {
    it('should create Injector instance if it does not exist', () => {
        expect(globalObject[INJECTOR_KEY]).toBeUndefined();

        const injector = getInjector();

        expect(injector).toBeInstanceOf(Bottle);
        expect(globalObject[INJECTOR_KEY]).toBeInstanceOf(Bottle);
        expect(globalObject[INJECTOR_KEY]).toEqual(injector);
    });
});
