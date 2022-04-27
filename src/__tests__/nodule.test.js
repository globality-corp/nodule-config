import { loadFromObject } from "../loaders";
import { getInjector } from "../injector";
import Nodule from "../nodule";

describe("Nodule", () => {
  let nodule;

  beforeEach(() => {
    nodule = Nodule.testing();
  });

  it("preserve metadata", async () => {
    expect(nodule.metadata.name).toEqual("test");
    expect(nodule.metadata.debug).toBe(false);
    expect(nodule.metadata.testing).toBe(true);
  });

  it("returns an empty config by default", async () => {
    const config = await nodule.load();

    expect(config).toEqual({});
  });

  it("returns defaults if specified", async () => {
    const bottle = getInjector();
    const { container } = bottle;
    container.defaults.foo = "default";

    const config = await nodule.load();

    expect(config).toEqual({
      foo: "default",
    });
  });

  it("returns environment configuration if specified", async () => {
    const bottle = getInjector();
    const { container } = bottle;
    container.defaults.foo = "default";

    process.env.TEST__FOO = "environ";

    const config = await nodule.fromEnvironment().load();

    expect(config).toEqual({
      foo: "environ",
    });
  });

  it("merges loaders in order", async () => {
    const bottle = getInjector();
    const { container } = bottle;
    container.defaults.foo = "default";

    process.env.TEST__FOO = "environ";

    const config = await nodule
      .fromEnvironment()
      .from(
        loadFromObject({
          foo: "object",
        })
      )
      .load();

    expect(config).toEqual({
      foo: "object",
    });
  });
});
