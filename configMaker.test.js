import { makeConfig } from "./configMaker";

const vars = {
  GROUP__VAR: 'X',
  VAR: 'Y',
  BOOL_VAR_FALSE: false,
  BOOL_VAR_TRUE: true,
  BOOL_VAR_FALSE_LITERAL: false,
  BOOL_VAR_TRUE_LITERAL: true,
  BOOL_VAR_FALSE_LITERAL_D: false,
  BOOL_VAR_TRUE_LITERAL_D: true,
  SECRET_VAR: 'SECRET_VALUE',
};

test("should merge all the configuration", () => {
  const config = makeConfig(vars);
  expect(config.group.var).toEqual("X");
  expect(config.secretVar).toEqual("SECRET_VALUE");
});
