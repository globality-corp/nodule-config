import { loadEach, loadFromObject } from "../func";
import Metadata from "../../metadata";

function loadFromObjectAsync(config) {
  return async () => Promise.resolve(config);
}

describe("loadFromObject", () => {
  it("should return the object", () => {
    const config = {
      foo: "bar",
      bar: {
        baz: "foo",
      },
    };
    expect(loadFromObject(config)(new Metadata({ name: "test" }))).toEqual(
      config
    );
  });
});

describe("loadEach", () => {
  it("should return the merged objects", async () => {
    const loader1 = loadFromObject({
      foo: "bar",
      bar: {
        baz: "foo",
      },
    });
    const loader2 = loadFromObject({
      baz: "foo",
      bar: {
        foo: "bar",
      },
    });
    const loader = loadEach(loader1, loader2);
    const config = await loader(new Metadata({ name: "test" }));

    expect(config).toEqual({
      foo: "bar",
      baz: "foo",
      bar: {
        foo: "bar",
        baz: "foo",
      },
    });
  });

  it("should resolve promises", async () => {
    const loader1 = loadFromObject({
      foo: "bar",
      bar: {
        baz: "foo",
      },
    });
    const loader2 = loadFromObjectAsync({
      baz: "foo",
      bar: {
        foo: "bar",
      },
    });
    const loader = loadEach(loader1, loader2);
    const config = await loader(new Metadata({ name: "test" }));

    expect(config).toEqual({
      foo: "bar",
      baz: "foo",
      bar: {
        foo: "bar",
        baz: "foo",
      },
    });
  });
});
