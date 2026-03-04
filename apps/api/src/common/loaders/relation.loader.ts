import DataLoader from 'dataloader';

export interface CreateLoaderOptions<TKey, TFetchResult, TResult> {
  fetch: (keys: readonly TKey[]) => Promise<TFetchResult[]>;
  accumulate: (acc: Record<string, TResult>, result: TFetchResult) => Record<string, TResult>;
  default: () => TResult;
  getKey?: (key: TKey) => string;
}

export interface CreateLoaderOneOptions<TKey, TResult> {
  fetch: (keys: readonly TKey[]) => Promise<TResult[]>;
  key: (result: TResult) => TKey;
  getKey?: (key: TKey) => string;
}

export interface CreateLoaderManyOptions<TKey, TResult>
  extends CreateLoaderOneOptions<TKey, TResult> {}

export abstract class RelationLoader {
  protected createLoader<TKey, TFetchResult, TResult>(
    options: CreateLoaderOptions<TKey, TFetchResult, TResult>,
  ): DataLoader<TKey, TResult> {
    return new DataLoader<TKey, TResult>(async (keys) => {
      const results = await options.fetch(keys);
      const map = results.reduce(options.accumulate, {} as Record<string, TResult>);
      const getKey = options.getKey ?? String;
      return keys.map((k) => map[getKey(k)] ?? options.default());
    });
  }

  protected createLoaderOne<TKey, TResult>(
    options: CreateLoaderOneOptions<TKey, TResult>,
  ): DataLoader<TKey, TResult | null> {
    const getKey = options.getKey ?? String;
    return this.createLoader<TKey, TResult, TResult | null>({
      fetch: options.fetch,
      accumulate: (acc, result) => ({ ...acc, [getKey(options.key(result))]: result }),
      default: () => null,
      getKey,
    });
  }

  protected createLoaderMany<TKey, TResult>(
    options: CreateLoaderManyOptions<TKey, TResult>,
  ): DataLoader<TKey, TResult[]> {
    const getKey = options.getKey ?? String;
    return this.createLoader<TKey, TResult, TResult[]>({
      fetch: options.fetch,
      accumulate: (acc, result) => {
        const k = getKey(options.key(result));
        return { ...acc, [k]: [...(acc[k] ?? []), result] };
      },
      default: () => [],
      getKey,
    });
  }
}
