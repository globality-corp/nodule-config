import { merge } from "lodash-es";

export function loadFromObject(object: any) {
  return () => object;
}

export function loadEach(...loaders: Array<(metadata: any) => any>) {
  return async (metadata: any) => {
    const resolved = await Promise.all(
      loaders.map((loader) => loader(metadata))
    );
    return resolved.reduce((acc, config) => merge(acc, config), {});
  };
}
