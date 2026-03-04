import { EntityRepository, ObjectId } from '@mikro-orm/mongodb';

export abstract class RelationService<TEntity extends object> {
  constructor(protected readonly repo: EntityRepository<TEntity>) {}

  getRepository(): EntityRepository<TEntity> {
    return this.repo;
  }

  findById(id: string): Promise<TEntity | null> {
    return id ? this.repo.findOne(new ObjectId(id) as any) : Promise.resolve(null);
  }

  findByIds(ids: readonly string[]): Promise<TEntity[]> {
    const unique = [...new Set(ids)].filter(Boolean);
    if (!unique.length) return Promise.resolve([]);
    return this.repo.find({ _id: { $in: unique.map((id) => new ObjectId(id)) } } as any);
  }
}
