import { Embedded, Entity, Index, PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { ProductImage } from './product-image.embeddable';
import { ProductRating } from './product-rating.embeddable';

@ObjectType()
@Entity()
@Index({
  properties: ['name', 'shortDescription', 'longDescription'],
  type: 'text',
  options: { weights: { name: 10, shortDescription: 5, longDescription: 1 } },
})
export class Product {
  @PrimaryKey()
  _id: ObjectId;

  @Field(() => ID)
  @SerializedPrimaryKey()
  id!: string;

  @Field()
  @Property()
  name: string;

  @Field()
  @Property()
  version: string;

  @Field(() => [ProductImage])
  @Embedded(() => ProductImage, { array: true })
  images: ProductImage[] = [];

  @Field()
  @Property()
  shortDescription: string;

  @Field()
  @Property()
  longDescription: string;

  @Field(() => Float)
  @Property()
  price: number;

  @Field(() => Float, { nullable: true })
  @Property({ nullable: true })
  listPrice?: number;

  @Field()
  @Property()
  inStock: boolean = true;

  @Field(() => ProductRating)
  @Embedded(() => ProductRating, { object: true })
  rating: ProductRating = new ProductRating();

  @Field()
  @Property()
  createdAt: Date = new Date();
}
