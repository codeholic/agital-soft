import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ReviewFilterInput {
  @Field(() => ID)
  productId: string;

  @Field(() => Int, { nullable: true })
  stars?: number;

  @Field(() => ID, { nullable: true })
  userId?: string;
}
