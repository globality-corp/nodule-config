import { Loader } from "./index";

beforeAll(() => {
  process.env.NAME = "testname";
  process.env.TESTNAME__GROUP__VAR = "X";
  process.env.TESTNAME__VAR = "Y";
  process.env.TESTNAME__BOOL_VAR_FALSE = "0";
  process.env.TESTNAME__BOOL_VAR_TRUE = "1";
  process.env.TESTNAME__BOOL_VAR_FALSE_LITERAL = "False";
  process.env.TESTNAME__BOOL_VAR_TRUE_LITERAL = "True";
  process.env.TESTNAME__BOOL_VAR_FALSE_LITERAL_D = "false";
  process.env.TESTNAME__BOOL_VAR_TRUE_LITERAL_D = "true";
});

test("Should have the correct length of keys", () => {
  const loader = new Loader();
  expect(loader.all().length).toBe(8);
});

describe("shouldLoadSecrets", () => {
  test("Loading secrets should be false", () => {
    process.env.MICROCOSM_ENV = "dev";
    const loader = new Loader();
    expect(loader.shouldLoadSecrets()).toBe(true);
  });

  test("Loading secrets should be false", () => {
    delete process.env.MICROCOSM_ENV;
    const loader = new Loader();
    expect(loader.shouldLoadSecrets()).toBe(false);
  });
});

describe("toStandardObject", () => {
  test("Check that the object removes the application name from the env vars", () => {
    const loader = new Loader();
    const obj = loader.toStandardObject();
    expect(obj.BOOL_VAR_FALSE_LITERAL).toBe(false); // We are parsing booleans by default
  });

  test("Should have the correct number of keys", () => {
    const loader = new Loader();
    const obj = loader.toStandardObject();
    const keys = Object.keys(obj);
    expect(keys.length).toBe(8);
  });
});

describe("toCombinedObject", () => {
  beforeEach(() => {
    process.env.MICROCOSM_ENVIRONMENT = "dev";
    process.env.MICROCOSM_CONFIG_VERSION = "0.0.0";
  });

  afterEach(() => {
    delete process.env.MICROCOSM_ENV;
    delete process.env.MICROCOSM_CONFIG_VERSION;
  });

  test("Should call the secrets function", () => {
    const loader = new Loader();

    const getVars = jest.fn().mockImplementation((version, env) => {
      expect(env).toBe("dev-testname-config");
      expect(version).toBe("0.0.0");

      return new Promise((resolve) => {
        resolve({ SECRET_VAR: "SECRET_VALUE" });
      });
    });

    return loader.toCombinedObject(getVars).then((combinedConfig) => {
      const keys = Object.keys(combinedConfig);
      expect(keys.length).toBe(9); // one secret and the prev config
    });
  });

  test("Should reject the entire function if the secrets had a problem fetching", () => {
    const loader = new Loader();

    const getVars = jest.fn().mockImplementation((ignoredversion, ignoredenv) => {
      return new Promise((resolve, reject) => {
        reject(`some error`);
      });
    });

    return loader.toCombinedObject(getVars).then((combinedConfig) => {
      // Make sure we never end up here
      expect(false).toBe(true);
    }).catch((error) => {
      expect(error).toBeTruthy();
    });
  });
});
