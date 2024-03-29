import Bottle from "bottlejs";

import { getContainer, getInjector } from "../injector";

describe("getInjector", () => {
  it("should create a bottle instance", () => {
    const bottle = getInjector();

    expect(bottle).toBeInstanceOf(Bottle);
  });

  it("should preserve the same bottle instance in the same scope", () => {
    const bottle = getInjector();

    expect(getInjector()).toBe(bottle);
  });

  it("should return different bottle instances for different scopes", () => {
    const bottle = getInjector();

    expect(getInjector("scope")).not.toBe(bottle);
  });
});

describe("getContainer", () => {
  it("should return a container", () => {
    const container = getContainer();

    expect(container).toBeDefined();
  });
});
