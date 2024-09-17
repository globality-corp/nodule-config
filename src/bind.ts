import type { IContainer } from "bottlejs";
import { merge, set } from "lodash-es";

import { DEFAULT_SCOPE } from "./constants.js";
import { getDefaults, getInjector } from "./injector.js";

/**
 * @returns {boolean} `true` if the name was bound to the factory, `false` if it was already bound
 * */
export function bind(
  name: string,
  factory: (container: IContainer<string>) => any,
  scope: string = DEFAULT_SCOPE
): boolean {
  const bottle = getInjector(scope);

  if (!(name in bottle.providerMap)) {
    bottle.factory(name, factory);
    return true;
  }

  return false;
}

function initDefaults() {
  return {};
}

export function setDefaults(
  name: string,
  object: any,
  scope: string = DEFAULT_SCOPE
) {
  bind("defaults", initDefaults);

  const defaults = getDefaults(scope);
  const value = {};
  set(value, name, object);
  merge(defaults, value);
}
