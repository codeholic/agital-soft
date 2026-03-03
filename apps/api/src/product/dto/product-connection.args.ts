import { ArgsType, Field } from '@nestjs/graphql';
import { IConnectionArgs, PaginationArgs } from '../../common/connections/types';
import { ProductFilterInput } from './product-filter.input';
import { ProductSortInput } from './product-sort.input';

@ArgsType()
export class ProductConnectionArgs
  extends PaginationArgs
  implements IConnectionArgs<ProductFilterInput, ProductSortInput>
{
  @Field(() => ProductFilterInput, { nullable: true })
  filter?: ProductFilterInput;

  @Field(() => [ProductSortInput], { nullable: true })
  sort?: ProductSortInput[];
}