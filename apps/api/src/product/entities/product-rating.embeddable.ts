import { Embeddable, Property } from '@mikro-orm/core';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@Embeddable()
@ObjectType()
export class ProductRating {
  @Field(() => Int)
  @Property()
  totalStars: number = 0;

  @Field(() => Int)
  @Property()
  reviewCount: number = 0;

  @Field(() => Float)
  @Property()
  averageRating: number = 0;
}
