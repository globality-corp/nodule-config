import { Loader } from "./index";

beforeAll(() => {
  process.env.NAME = "TESTNAME";
  process.env.TESTNAME__GROUP__VAR = "X";
  process.env.TESTNAME__VAR = "Y";
  process.env.TESTNAME__BOOL_VAR_FALSE = "0";
  process.env.TESTNAME__BOOL_VAR_TRUE = "1";
  process.env.TESTNAME__BOOL_VAR_FALSE_LITERAL = "False";
  process.env.TESTNAME__BOOL_VAR_TRUE_LITERAL = "True";
  process.env.TESTNAME__BOOL_VAR_FALSE_LITERAL_D = "false";
  process.env.TESTNAME__BOOL_VAR_TRUE_LITERAL_D = "true";
});

test('Should have the correct length of keys', () => {
  const loader = new Loader();
  expect(loader.all().length).toBe(8);
});

describe("shouldLoadSecrets", () => {
  test('Loading secrets should be false', () => {
    process.env.MICROCOSM_ENV = "dev";
    const loader = new Loader();
    expect(loader.shouldLoadSecrets()).toBe(true);
  });

  test('Loading secrets should be false', () => {
    delete process.env.MICROCOSM_ENV;
    const loader = new Loader();
    expect(loader.shouldLoadSecrets()).toBe(false);
  });
});


describe("toStandardObject", () => {

});
