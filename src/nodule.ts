import { bind } from "./bind";
import { DEFAULT_SCOPE } from "./constants";
import { getContainer } from "./injector";
import {
  loadEach,
  loadFromEnvironment,
  loadFromObject,
  loadFromSecretsManager,
} from "./loaders";
import Metadata, { MetadataType } from "./metadata";

export default class Nodule {
  public metadata: Metadata;

  public loaders: any[];

  public scope: string;

  public declassifiedLoaders: any[];

  constructor(
    metadata: MetadataType,
    loaders: any[] = [],
    scope: string = DEFAULT_SCOPE
  ) {
    this.metadata = new Metadata(metadata);
    this.loaders = loaders;
    this.scope = scope;

    // Declassified loaders contain configuration that does not contain any secrets
    this.declassifiedLoaders = [];

    bind("metadata", () => this.metadata);
  }

  from(value: any, classified = false) {
    this.loaders.push(value);
    if (!classified) {
      this.declassifiedLoaders.push(value);
    }
    return this;
  }

  fromSecretsManager() {
    return this.from(loadFromSecretsManager, true);
  }

  fromEnvironment() {
    return this.from(loadFromEnvironment);
  }

  fromObject(obj: any) {
    return this.from(loadFromObject(obj));
  }

  async load() {
    const { defaults, metadata } = getContainer(undefined, this.scope);

    // NB: This can be further optimized to load each loader only once
    const loader = loadEach(loadFromObject(defaults), ...this.loaders);

    const declassifiedLoader = loadEach(
      loadFromObject(defaults),
      ...this.declassifiedLoaders
    );

    return declassifiedLoader(metadata).then((declassifiedConfig) => {
      bind("declassifiedConfig", () => declassifiedConfig);
      return loader(metadata).then((config) => {
        bind("config", () => config);
        return config;
      });
    });
  }

  static testing(name = "test") {
    return new Nodule({ name, testing: true });
  }
}
