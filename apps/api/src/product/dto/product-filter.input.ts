import { Field, InputType } from '@nestjs/graphql';
import { BooleanFilterInput } from '../../common/connections/dto/boolean-filter.input';
import { StringFilterInput } from '../../common/connections/dto/string-filter.input';

@InputType()
export class ProductFilterInput {
  @Field(() => StringFilterInput, { nullable: true })
  name?: StringFilterInput;

  @Field(() => BooleanFilterInput, { nullable: true })
  inStock?: BooleanFilterInput;

  /** Full-text search across name, shortDescription, longDescription */
  @Field(() => String, { nullable: true })
  search?: string;
}
