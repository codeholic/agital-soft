import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mongodb';
import { ObjectId } from '@mikro-orm/mongodb';
import { FilterQuery } from '@mikro-orm/core';
import { ClientSession } from 'mongodb';
import { Review } from './entities/review.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { IConnectionArgs, IConnectionQuery, IConnectionService } from '../common/connections/types';
import { ReviewFilterInput } from './dto/review-filter.input';

@Injectable()
export class ReviewService
  implements IConnectionService<Review, ReviewFilterInput, never>
{
  constructor(
    @InjectRepository(Review) private readonly reviewRepo: EntityRepository<Review>,
    @InjectRepository(User) private readonly userRepo: EntityRepository<User>,
  ) {}

  getRepository(): EntityRepository<Review> {
    return this.reviewRepo;
  }

  buildConnectionQuery(
    args: IConnectionArgs<ReviewFilterInput, never>,
  ): IConnectionQuery<Review> {
    const { productId, stars, userId } = args.filter!;
    const where: FilterQuery<Review> = { productId };
    if (stars) where.stars = stars;
    if (userId) where.userId = userId;
    return { where, orderBy: { createdAt: 'desc' } };
  }

  async addReview(
    productId: string,
    userId: string,
    stars: number,
    text: string,
  ): Promise<Review> {
    const user = await this.userRepo.findOne(new ObjectId(userId));
    if (!user) throw new UnauthorizedException();

    const em = this.reviewRepo.getEntityManager();
    let review: Review;

    try {
      await em.transactional(async (tem) => {
        review = tem.create(Review, { productId, userId, name: user.name, stars, text, createdAt: new Date() });
        await tem.flush();

        const session = tem.getTransactionContext() as ClientSession;
        const productCol = tem.getDriver().getConnection().getCollection<Product>('product');
        await productCol.updateOne(
          { _id: new ObjectId(productId) },
          [{ $set: {
            'rating.totalStars':    { $add: [{ $ifNull: ['$rating.totalStars', 0] }, stars] },
            'rating.reviewCount':   { $add: [{ $ifNull: ['$rating.reviewCount', 0] }, 1] },
            'rating.averageRating': { $divide: [
              { $add: [{ $ifNull: ['$rating.totalStars', 0] }, stars] },
              { $add: [{ $ifNull: ['$rating.reviewCount', 0] }, 1] },
            ]},
          }}],
          { session },
        );
      });
    } catch (e: any) {
      if (e.code === 11000) throw new ConflictException('Sie haben dieses Produkt bereits bewertet');
      throw e;
    }

    return review!;
  }
}
