import { binding } from '../decorators';
import getInjector from '../getInjector';

const TEST_CLASS_A_VALUE = 'test-class-a-value';
const TEST_CLASS_B_VALUE = 'test-class-b-value';

@binding()
// eslint-disable-next-line
class TestClassA {
    constructor() {
        this.value = TEST_CLASS_A_VALUE;
    }

    getSomeValue() {
        return this.value;
    }
}

@binding()
// eslint-disable-next-line
class TestClassB {
    constructor() {
        this.value = TEST_CLASS_B_VALUE;
    }
}

// eslint-disable-next-line
class TestClassC {}

@binding('customNameForD')
// eslint-disable-next-line
class TestClassD {
    constructor(graph) {
        this.testClassA = graph.testClassA;
    }

    get aValue() {
        return this.testClassA.getSomeValue();
    }
}

describe('Injector binding', () => {
    const injector = getInjector();

    it('Should not find non-registered dependency', () => {
        expect(injector.container.testClassC).toBeUndefined();
    });

    it('Should retrieve registered class instance', () => {
        const testClassAInstance = injector.container.testClassA;

        expect(testClassAInstance.value).toEqual(TEST_CLASS_A_VALUE);
    });

    it('Should retrieve dependency by name', () => {
        const classDInstance = injector.container.customNameForD;

        expect(classDInstance.aValue).toEqual(TEST_CLASS_A_VALUE);
    });

    it('Should not allow circular dependencies', () => {
        injector.factory('first', graph => graph.second);
        injector.factory('second', graph => graph.first);

        expect(() => injector.container.first).toThrow();
        expect(() => injector.container.second).toThrow();
    });
});
