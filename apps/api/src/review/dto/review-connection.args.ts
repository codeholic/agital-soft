import { ArgsType, Field } from '@nestjs/graphql';
import { IConnectionArgs, PaginationArgs } from '../../common/connections/types';
import { ReviewFilterInput } from './review-filter.input';

@ArgsType()
export class ReviewConnectionArgs
  extends PaginationArgs
  implements IConnectionArgs<ReviewFilterInput, never>
{
  @Field(() => ReviewFilterInput)
  filter: ReviewFilterInput;
}
