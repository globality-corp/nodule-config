import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

import { camelCase } from "lodash-es";

import { CREDSTASH_PREFIX } from "../constants.js";
import Metadata from "../metadata.js";

import { convert } from "./convert.js";

export function getClient() {
  const awsRegion = process.env.AWS_DEFAULT_REGION || process.env.AWS_REGION;

  return new SecretsManagerClient({
    region: awsRegion,
  });
}

function convertValues(obj: any) {
  if (typeof obj !== "object") return convert(obj);

  const newObj: Record<string, string> = {};

  Object.keys(obj).forEach((name) => {
    newObj[camelCase(name)] = convertValues(obj[name]);
  });

  return newObj;
}

function getEnvVarValueOrFail(metadata: Metadata, envVarName: string) {
  const value = process.env[envVarName];

  if (!value && !metadata.debug) {
    const message = `Must define environment variable: ${envVarName}`;
    throw new Error(message);
  }

  return value;
}

export default async function loadFromSecretsManager(
  metadata: Metadata,
  clientOverride?: SecretsManagerClient
) {
  const version = getEnvVarValueOrFail(
    metadata,
    `${CREDSTASH_PREFIX}_CONFIG_VERSION`
  );
  const environment = getEnvVarValueOrFail(
    metadata,
    `${CREDSTASH_PREFIX}_ENVIRONMENT`
  );

  if (!version || !environment) {
    if (!metadata.debug) {
      const message = "Could not find required env variables";
      throw new Error(message);
    }
    return {};
  }

  const secretId = `secrets/${environment}/${metadata.name}`;
  const client = clientOverride ?? getClient();

  const result = await client.send(
    new GetSecretValueCommand({ SecretId: secretId, VersionStage: version })
  );

  // @ts-expect-error this should be addressed
  return convertValues(JSON.parse(result.SecretString).config);
}
