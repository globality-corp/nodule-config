import { bind, setDefaults } from "../bind";
import { getContainer, getInjector } from "../injector";

describe("bind", () => {
  it("registers a factory", () => {
    const bottle = getInjector();
    const { container } = bottle;

    // @ts-ignore
    expect(bottle.providerMap.foo).toBeUndefined();
    expect(container.foo).toBe(undefined);

    const factory = () => 42;

    bind("foo", factory);

    // @ts-ignore
    expect(bottle.providerMap.foo).toBe(true);
    expect(container.foo).toBe(42);
  });
});

describe("setDefaults", () => {
  it("sets defaults", () => {
    const container = getContainer();

    expect(container.defaults.foo).toBeUndefined();

    setDefaults("foo", { bar: "baz" });
    expect(container.defaults.foo).toEqual({
      bar: "baz",
    });
  });

  it("merges latest call", () => {
    const container = getContainer();

    setDefaults("foo", { bar: "baz" });
    setDefaults("foo", { baz: "bar" });
    expect(container.defaults.foo).toEqual({
      baz: "bar",
      bar: "baz",
    });
  });
});
