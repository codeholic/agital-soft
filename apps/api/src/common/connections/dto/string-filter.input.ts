import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class StringFilterInput {
  @Field(() => String, { nullable: true })
  eq?: string;

  @Field(() => String, { nullable: true })
  contains?: string;
}
