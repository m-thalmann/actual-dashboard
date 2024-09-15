// eslint-disable-next-line @typescript-eslint/ban-types
export interface Type<T> extends Function {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: Array<any>): T;
}

export class DI {
  private static readonly INSTANCES: Map<Type<unknown>, unknown> = new Map<Type<unknown>, unknown>();

  static bind<T>(abstract: Type<T>, instance: T): void {
    DI.INSTANCES.set(abstract, instance);
  }

  static get<T>(abstract: Type<T>): T {
    const instance = DI.INSTANCES.get(abstract) as T | undefined;

    if (instance === undefined) {
      throw new Error(`No instance for ${abstract.name} found`);
    }

    return instance;
  }
}
