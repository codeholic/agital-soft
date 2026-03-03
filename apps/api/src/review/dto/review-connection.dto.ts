import { ObjectType } from '@nestjs/graphql';
import { createConnectionClass } from '../../common/connections/types';
import { Review } from '../entities/review.entity';

@ObjectType()
export class ReviewConnectionDto extends createConnectionClass(Review) {}
