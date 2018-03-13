import { camelCase } from 'lodash';
import getInjector from './getInjector';

function nodeName(tokenOrClass) {
    if (typeof tokenOrClass === 'string') {
        return tokenOrClass;
    }

    return camelCase(tokenOrClass.name);
}

/*
 * Class decorator, registering the given class in the injector.
 * It assumes, that the target class has a constructor
 * expecting single argument - an injector graph.
 *
 * nullableNodeName - the name of the dependency can be provided,
 * if not `class.name` will be picked as a name, e.g. class `TestClass`
 * will be accessible on the graph under `graph.testClass` key.
 */
export default function binding(nullableNodeName) {
    const bottle = getInjector();

    return (TargetClass) => {
        const name = nullableNodeName || nodeName(TargetClass);

        bottle.factory(name, graph => new TargetClass(graph));
    };
}
