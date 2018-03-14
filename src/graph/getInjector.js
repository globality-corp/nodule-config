import { Bottle } from 'bottlejs';

export const INJECTOR_KEY = Symbol.for('graph');
export const globalObject = global;

/*
 * Injector factory method and injector singleton guard.
 * Wires the Injector instance to the `global` object,
 * to assure there exists exacly one instance of injector.
 */
export default function getInjector() {
  if (!globalObject[INJECTOR_KEY]) {
    globalObject[INJECTOR_KEY] = new Bottle();
  }

  return globalObject[INJECTOR_KEY];
}
