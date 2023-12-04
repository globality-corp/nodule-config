import { camelCase, set } from "lodash";

import { SEPARATOR } from "../constants";

/**
 * Transform environment variables to dotted keys.
 * */
export function dotify(envvar: string) {
  return envvar.split(SEPARATOR).map(camelCase).join(".");
}

/**
 * Convert a boolean value to a boolean type.
 * */
export function convertBoolean(value: any) {
  const stringValue = value.toString().toLowerCase();
  if (stringValue === "0" || stringValue === "false") {
    return false;
  }
  if (stringValue === "1" || stringValue === "true") {
    return true;
  }
  return null;
}

/**
 * Convert values to appropriate types.
 * */
export function convert(value: any) {
  // XXX conversion should be configurable
  const converted = convertBoolean(value);
  if (converted !== null) {
    return converted;
  }
  return value;
}

export default function toObject(key: string, value: any) {
  const config = {};
  set(config, dotify(key), convert(value));
  return config;
}
