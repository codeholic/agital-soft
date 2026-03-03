import { Embeddable, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

@Embeddable()
@ObjectType()
export class ProductImage {
  @Field()
  @Property()
  url: string;

  @Field()
  @Property()
  alt: string;
}
