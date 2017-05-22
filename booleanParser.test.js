'use strict';

import { isBoolean, parse } from "./booleanParser"


test('It should be false when the value is 0', () => {
  expect(parse("0")).toBe(false)
  expect(parse(0)).toBe(false)
});

test('It should be true when the value is 1', () => {
  expect(parse("1")).toBe(true)
  expect(parse(1)).toBe(true)
});

test('It should be true when the value is true or True', () => {
  expect(parse("True")).toBe(true)
  expect(parse("true")).toBe(true)
});

test('It should be false when the value is false or False', () => {
  expect(parse("false")).toBe(false)
  expect(parse("False")).toBe(false)
});

test('It should be a string and not boolean', () => {
  expect(isBoolean("SomethingElse")).toBe(false)
  expect(isBoolean("Boom")).toBe(false)
});
