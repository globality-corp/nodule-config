import AWS from "aws-sdk";
import { camelCase } from "lodash";

import { CREDSTASH_PREFIX } from "../constants";
import { convert } from "./convert";

export function getClient() {
  const awsRegion = process.env.AWS_DEFAULT_REGION || process.env.AWS_REGION;

  return new AWS.SecretsManager({
    region: awsRegion,
  });
}

function convertValues(obj) {
  if (typeof obj !== "object") return convert(obj);

  const newObj = {};

  Object.keys(obj).forEach((name) => {
    newObj[camelCase(name)] = convertValues(obj[name]);
  });

  return newObj;
}

function getEnvVarValueOrFail(metadata, envVarName) {
  const value = process.env[envVarName];

  if (!value && !metadata.debug) {
    const message = `Must define environment variable: ${envVarName}`;
    throw new Error(message);
  }

  return value;
}

export default async function loadFromSecretsManager(metadata) {
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
  const client = getClient();

  const secrets = await new Promise((resolve, reject) => {
    client.getSecretValue(
      {
        SecretId: secretId,
        VersionStage: version,
      },
      (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(convertValues(JSON.parse(data.SecretString).config));
      }
    );
  });

  return secrets;
}
