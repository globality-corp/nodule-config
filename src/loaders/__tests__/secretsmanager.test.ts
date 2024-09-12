import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { mockClient } from "aws-sdk-client-mock";

import Metadata from "../../metadata";
import loadFromSecretsManager from "../secretsManager";

describe("loadFromSecretsManager", () => {
  const client = new SecretsManagerClient({});
  const mockedClient = mockClient(client);

  afterEach(() => {
    mockedClient.reset();
  });

  it("does not call the AWS client when microcosm config is not present", async () => {
    mockedClient.on(GetSecretValueCommand).resolves({
      SecretString: JSON.stringify({ config: {} }),
    });

    const metadata = new Metadata({
      name: "test",
      testing: true,
      debug: true,
    });

    const config = await loadFromSecretsManager(metadata, client);

    expect(config).toEqual({});
  });

  it("calls the AWS client when microcosm config not present", async () => {
    process.env.MICROCOSM_CONFIG_VERSION = "1.0.0";
    process.env.MICROCOSM_ENVIRONMENT = "whatever";

    mockedClient.on(GetSecretValueCommand).resolves({
      SecretString: JSON.stringify({ config: { test: true } }),
    });

    const metadata = new Metadata({
      name: "test",
      testing: true,
      debug: true,
    });
    const config = await loadFromSecretsManager(metadata, client);

    expect(config).toEqual({ test: true });

    delete process.env.MICROCOSM_CONFIG_VERSION;
    delete process.env.MICROCOSM_ENVIRONMENT;
  });

  it("Converts booleans from the secret string", async () => {
    process.env.MICROCOSM_CONFIG_VERSION = "1.0.0";
    process.env.MICROCOSM_ENVIRONMENT = "whatever";

    mockedClient.on(GetSecretValueCommand).resolves({
      SecretString: JSON.stringify({
        config: {
          postgres: {
            password: "xyz",
            isDatabase: "True",
          },
        },
      }),
    });

    const metadata = new Metadata({
      name: "test",
      testing: true,
      debug: true,
    });

    const config = await loadFromSecretsManager(metadata, client);

    expect(config.postgres.isDatabase).toEqual(true);

    delete process.env.MICROCOSM_CONFIG_VERSION;
    delete process.env.MICROCOSM_ENVIRONMENT;
  });

  it("Converts snake_cased variables from the secret string", async () => {
    process.env.MICROCOSM_CONFIG_VERSION = "1.0.0";
    process.env.MICROCOSM_ENVIRONMENT = "whatever";

    mockedClient.on(GetSecretValueCommand).resolves({
      SecretString: JSON.stringify({
        config: {
          secret_config: {
            auth_token: "xyz",
            store_secret: "True",
          },
        },
      }),
    });

    const metadata = new Metadata({
      name: "test",
      testing: true,
      debug: true,
    });
    const config = await loadFromSecretsManager(metadata, client);

    expect(config.secretConfig.authToken).toEqual("xyz");
    expect(config.secretConfig.storeSecret).toEqual(true);

    delete process.env.MICROCOSM_CONFIG_VERSION;
    delete process.env.MICROCOSM_ENVIRONMENT;
  });
});
