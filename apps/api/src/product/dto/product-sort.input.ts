import { Field, InputType } from '@nestjs/graphql';
import { SortOrder } from '../../common/connections/types';

@InputType()
export class ProductSortInput {
  @Field(() => SortOrder, { nullable: true })
  createdAt?: SortOrder;

  @Field(() => SortOrder, { nullable: true })
  averageRating?: SortOrder;

  @Field(() => SortOrder, { nullable: true })
  price?: SortOrder;
}
