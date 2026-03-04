import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { ReviewConnectionDto } from './dto/review-connection.dto';
import { PaginationArgs } from '../common/connections/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver()
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query(() => ReviewConnectionDto)
  async reviews(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('stars', { type: () => Int, nullable: true }) stars: number | undefined,
    @Args('userId', { type: () => ID, nullable: true }) userId: string | undefined,
    @Args() pagination: PaginationArgs,
  ): Promise<ReviewConnectionDto> {
    return this.reviewService.findByProductConnection(
      productId,
      pagination.first,
      pagination.after,
      stars,
      userId,
    ) as Promise<ReviewConnectionDto>;
  }

  @Mutation(() => Review)
  @UseGuards(JwtAuthGuard)
  async addReview(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('stars', { type: () => Int }) stars: number,
    @Args('text') text: string,
    @CurrentUser() user: { sub: string },
  ): Promise<Review> {
    return this.reviewService.addReview(productId, user.sub, stars, text);
  }
}
