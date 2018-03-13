import { makeConfig, mergeConfigSections } from "./configMaker";

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


/* Test config merging.  */
function foo() {
  return {
    bar: 'baz',
  };
}


function bar() {
  return {
    baz: 'qux',
  };
}


test('merging configuration sections', () => {
  it('invokes callables', () => {
    const sections = {
      foo,
      bar,
    };
    expect(
      mergeConfigSections({}, sections),
    ).toEqual({
      foo: {
        bar: 'baz',
      },
      bar: {
        baz: 'qux',
      },
    });
  });

  it('overrides with later values', () => {
    const sections = {
      foo,
    };
    expect(
      mergeConfigSections({ foo: { bar: 'qux' } }, sections),
    ).toEqual({
      foo: {
        bar: 'baz',
      },
    });
  });
});
