import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mongodb';
import { FilterQuery } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { Product } from './entities/product.entity';
import {
  IConnectionArgs,
  IConnectionQuery,
  IConnectionService,
} from '../common/connections/types';
import { ProductFilterInput } from './dto/product-filter.input';
import { ProductSortInput } from './dto/product-sort.input';

@Injectable()
export class ProductService
  implements IConnectionService<Product, ProductFilterInput, ProductSortInput>
{
  constructor(
    @InjectRepository(Product)
    private readonly repo: EntityRepository<Product>,
  ) {}

  getRepository(): EntityRepository<Product> {
    return this.repo;
  }

  buildConnectionQuery(
    args: IConnectionArgs<ProductFilterInput, ProductSortInput>,
  ): IConnectionQuery<Product> {
    const where: FilterQuery<Product> = {};

    if (args.filter?.search) {
      (where as any).$text = { $search: args.filter.search };
    }

    if (args.filter?.name?.eq) {
      where.name = args.filter.name.eq;
    } else if (args.filter?.name?.contains) {
      (where as any).name = { $regex: args.filter.name.contains, $options: 'i' };
    }

    if (args.filter?.inStock?.eq !== undefined) {
      where.inStock = args.filter.inStock.eq;
    }

    const orderBy: Record<string, any> = {};
    for (const sortItem of args.sort ?? []) {
      if (sortItem.createdAt) orderBy['createdAt'] = sortItem.createdAt;
      if (sortItem.price) orderBy['price'] = sortItem.price;
      if (sortItem.averageRating) {
        orderBy['rating'] = { averageRating: sortItem.averageRating };
      }
    }

    return {
      where,
      orderBy: Object.keys(orderBy).length ? orderBy : undefined,
    };
  }

  async findById(id: string): Promise<Product | null> {
    return this.repo.findOne(new ObjectId(id));
  }
}
