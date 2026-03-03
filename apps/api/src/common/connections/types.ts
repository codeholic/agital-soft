import { Type } from '@nestjs/common';
import { ArgsType, Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { FilterQuery } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { PageInfo } from './dto/page-info.dto';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(SortOrder, { name: 'SortOrder' });

export interface IConnectionArgs<TFilter, TSort> {
  after?: string;
  first?: number;
  filter?: TFilter;
  sort?: TSort[];
}

export interface IConnectionQuery<TEntity> {
  where: FilterQuery<TEntity>;
  orderBy?: Record<string, any>;
}

export interface IConnectionService<TEntity extends object, TFilter, TSort> {
  buildConnectionQuery(args: IConnectionArgs<TFilter, TSort>): IConnectionQuery<TEntity>;
  getRepository(): EntityRepository<TEntity>;
}

export interface IEdge<TEntity> {
  cursor: string;
  node: TEntity;
}

export interface IConnection<TEntity> {
  edges: IEdge<TEntity>[];
  pageInfo: PageInfo;
  totalCount: number;
}

export function createConnectionClass<TEntity>(
  entityClassRef: Type<TEntity>,
): Type<IConnection<TEntity>> {
  @ObjectType(`${entityClassRef.name}Edge`, { isAbstract: true })
  class EdgeType implements IEdge<TEntity> {
    @Field(() => String)
    cursor: string;

    @Field(() => entityClassRef)
    node: TEntity;
  }

  @ObjectType({ isAbstract: true })
  class ConnectionType implements IConnection<TEntity> {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => PageInfo, { nullable: true })
    pageInfo: PageInfo;

    @Field(() => Int)
    totalCount: number;
  }

  return ConnectionType;
}

@ArgsType()
export class PaginationArgs {
  @Field(() => String, { nullable: true })
  after?: string;

  @Field(() => Int, { nullable: true })
  first?: number;
}
