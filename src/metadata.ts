export type MetadataType = {
  name: string;
  debug?: boolean;
  testing?: boolean;
};

export default class Metadata {
  public name: string;

  public debug: boolean;

  public testing: boolean;

  constructor({ name, debug = false, testing = false }: MetadataType) {
    this.name = name;
    this.debug = debug;
    this.testing = testing;
  }
}
