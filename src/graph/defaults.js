import { camelCase } from 'lodash';
import getInjector from './getInjector';
import binding from './binding';

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
function defaults(defaultValues) {
  const graph = getInjector();
  if (!graph.container.defaults) {
      const defaults = {};
      graph.factory('defaults', () => defaults);
  }

  return (TargetClass) => {
      const name = nodeName(TargetClass);
      graph.container.defaults[name] = defaultValues;
      return TargetClass;
  };
}

module.exports = {
    defaults,
}
