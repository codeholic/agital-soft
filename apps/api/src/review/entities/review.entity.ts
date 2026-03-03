import { Entity, Index, PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
@Index({ properties: ['productId', 'userId'], options: { unique: true } })
export class Review {
  @PrimaryKey()
  _id: ObjectId;

  @Field(() => ID)
  @SerializedPrimaryKey()
  id!: string;

  @Field(() => ID)
  @Property()
  productId: string;

  @Field(() => ID)
  @Property()
  userId: string;

  @Field(() => Int)
  @Property()
  stars: number;

  @Field()
  @Property()
  name: string;

  @Field()
  @Property()
  text: string;

  @Field()
  @Property()
  createdAt: Date = new Date();
}
