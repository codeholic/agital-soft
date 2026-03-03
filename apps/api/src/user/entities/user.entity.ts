import { Entity, Index, PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
@Index({ properties: ['email'], options: { unique: true } })
export class User {
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
  birthDate: Date;

  @Field()
  @Property()
  email: string;

  @Property()
  passwordSha512: string;

  @Property()
  passwordSalt: string;

  @Field()
  @Property()
  createdAt: Date = new Date();
}
