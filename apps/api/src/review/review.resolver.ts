import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AbstractConnectionResolver } from '../common/connections/abstract-connection.resolver';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { ReviewConnectionDto } from './dto/review-connection.dto';
import { ReviewConnectionArgs } from './dto/review-connection.args';
import { ReviewFilterInput } from './dto/review-filter.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver()
export class ReviewResolver extends AbstractConnectionResolver<Review, ReviewFilterInput, never> {
  constructor(private readonly reviewService: ReviewService) {
    super();
  }

  @Query(() => ReviewConnectionDto)
  async reviews(@Args() args: ReviewConnectionArgs): Promise<ReviewConnectionDto> {
    return this.resolveConnection(this.reviewService, args) as Promise<ReviewConnectionDto>;
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
