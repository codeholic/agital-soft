import { Args, Context, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { ReviewConnectionDto } from './dto/review-connection.dto';
import { PaginationArgs } from '../common/connections/types';

@Resolver()
export class ReviewResolver {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly jwtService: JwtService,
  ) {}

  @Query(() => ReviewConnectionDto)
  async reviews(
    @Args('productId', { type: () => ID }) productId: string,
    @Args() pagination: PaginationArgs,
  ): Promise<ReviewConnectionDto> {
    return this.reviewService.findByProductConnection(
      productId,
      pagination.first,
      pagination.after,
    ) as Promise<ReviewConnectionDto>;
  }

  @Mutation(() => Review)
  async addReview(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('stars', { type: () => Int }) stars: number,
    @Args('text') text: string,
    @Context() ctx: any,
  ): Promise<Review> {
    const auth = ctx.req?.headers?.authorization as string | undefined;
    if (!auth) throw new UnauthorizedException();
    try {
      const payload = this.jwtService.verify<{ sub: string }>(auth.replace('Bearer ', ''));
      return this.reviewService.addReview(productId, payload.sub, stars, text);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
