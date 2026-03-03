import { IConnection, IConnectionArgs, IConnectionService } from './types';

export abstract class AbstractConnectionResolver<TEntity extends object, TFilter, TSort> {
  protected parsePagination(args: IConnectionArgs<TFilter, TSort>): { limit: number; offset: number } {
    const limit = args.first ?? 20;
    const offset = args.after
      ? Number(Buffer.from(args.after, 'base64url').toString('ascii')) + 1
      : 0;
    return { limit, offset };
  }

  protected async resolveConnection(
    service: IConnectionService<TEntity, TFilter, TSort>,
    args: IConnectionArgs<TFilter, TSort>,
  ): Promise<IConnection<TEntity>> {
    const { where, orderBy } = service.buildConnectionQuery(args);
    const { limit, offset } = this.parsePagination(args);

    const [items, total] = await service.getRepository().findAndCount(where, {
      orderBy: orderBy as any,
      limit,
      offset,
    });

    const edges = items.map((node, index) => ({
      cursor: Buffer.from((offset + index).toString()).toString('base64url'),
      node,
    }));

    return {
      edges,
      pageInfo: {
        startCursor: edges[0]?.cursor,
        endCursor: edges[edges.length - 1]?.cursor,
        hasNextPage: total > offset + limit,
        hasPreviousPage: offset > 0,
      },
      totalCount: total,
    };
  }
}
