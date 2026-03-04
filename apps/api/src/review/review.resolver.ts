import { Args, ID, Int, Mutation, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AbstractConnectionResolver } from '../common/connections/abstract-connection.resolver';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { ReviewConnectionDto } from './dto/review-connection.dto';
import { ReviewConnectionArgs } from './dto/review-connection.args';
import { ReviewFilterInput } from './dto/review-filter.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserLoader } from '../user/user.loader';
import { User } from '../user/entities/user.entity';

@Resolver(() => Review)
export class ReviewResolver extends AbstractConnectionResolver<Review, ReviewFilterInput, never> {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly userLoader: UserLoader,
  ) {
    super();
  }

  @Query(() => ReviewConnectionDto)
  async reviews(@Args() args: ReviewConnectionArgs): Promise<ReviewConnectionDto> {
    return this.resolveConnection(this.reviewService, args) as Promise<ReviewConnectionDto>;
  }

  @ResolveField(() => User, { nullable: true })
  async user(@Root() review: Review): Promise<User | null> {
    return this.userLoader.byId.load(review.userId);
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
