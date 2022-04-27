import Bottle from "bottlejs";
import { get, unset } from "lodash";
import { Function, Object, String } from "ts-toolbelt";

import { DEFAULT_SCOPE } from "./constants";

export function getInjector(scope?: string): Bottle {
  const key = scope || DEFAULT_SCOPE;
  const bottle = Bottle.pop(key);

  if (!get(bottle.providerMap, "defaults")) {
    bottle.factory("defaults", () => ({}));
  }

  return bottle;
}

export function getContainer(): Bottle.IContainer;
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

export function getConfig<
  Config extends Record<string, unknown>,
  Path extends string
>(
  target: Function.AutoPath<Config, Path>,
  scope?: string
): Object.Path<Config, String.Split<Path, ".">> {
  const config = getContainer("config", scope);
  return get(config, target) as Object.Path<Config, String.Split<Path, ".">>;
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
