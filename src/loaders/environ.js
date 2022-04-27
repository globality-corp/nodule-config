import { merge } from "lodash";

import { SEPARATOR } from "../constants";
import toObject from "./convert";

/* Load configuration from environment variables.
 *
 *  - Filters out configuration that does not match the metdata name.
 *  - Expands keys into to nested objects
 *  - Converts values to booleans
 */
export default function loadFromEnvironment(metadata) {
  const keys = Object.keys(process.env);
  const regex = new RegExp(`^${metadata.name.toUpperCase()}${SEPARATOR}`, "g");
  return keys
    .filter((envvar) => envvar.match(regex))
    .reduce((acc, envvar) => {
      const key = envvar.replace(regex, "");
      const value = process.env[envvar];
      return merge(acc, toObject(key, value));
    }, {});
}
