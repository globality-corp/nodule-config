import { camelCase } from "./helpers";

test('Should return the correct key', () => {
  expect(camelCase("something_new")).toBe("somethingNew");
});

test('Should not touch the key if it does not match', () => {
  expect(camelCase("something")).toBe("something");
});
