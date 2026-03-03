import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BooleanFilterInput {
  @Field(() => Boolean)
  eq: boolean;
}
