import Bottle from "bottlejs";
import { get, unset } from "lodash-es";

import { DEFAULT_SCOPE } from "./constants.js";

export function getInjector(scope?: string): Bottle {
  const key = scope || DEFAULT_SCOPE;
  const bottle = Bottle.pop(key);

  // @ts-expect-error providerMap is not typed
  if (!bottle.providerMap.defaults) {
    bottle.factory("defaults", () => ({}));
  }

  return bottle;
}

export function getContainer(): Bottle.IContainer;
export function getContainer(
  target?: string,
  scope?: string
): Bottle.IContainer;
export function getContainer<T>(target?: string, scope?: string): T;
export function getContainer<T = void>(
  target?: string,
  scope?: string
): T | Bottle.IContainer {
  const { container } = getInjector(scope);
  if (target) {
    return get(container, target) as T;
  }
  return container;
}

export function getConfig<T>(target: string, scope?: string): T {
  const config = getContainer("config", scope);
  return get(config, target);
}

export function getDefaults(scope?: string) {
  return getContainer("defaults", scope);
}

export function getMetadata(scope?: string) {
  return getContainer("metadata", scope);
}

/* Clear references to a specific named binding.
 */
export function clearBinding(name: string, scope?: string) {
  const bottle = getInjector(scope);
  unset(bottle.providerMap, name);
  unset(bottle.container, name);
  unset(bottle.container, `${name}Provider`);
}
