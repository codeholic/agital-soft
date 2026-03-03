import { ObjectType } from '@nestjs/graphql';
import { createConnectionClass } from '../../common/connections/types';
import { Product } from '../entities/product.entity';

@ObjectType()
export class ProductConnectionDto extends createConnectionClass(Product) {}
