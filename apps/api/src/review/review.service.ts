import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, ObjectId } from '@mikro-orm/mongodb';
import { FilterQuery } from '@mikro-orm/core';
import { Review } from './entities/review.entity';
import { Product } from '../product/entities/product.entity';
import { IConnectionArgs, IConnectionQuery, IConnectionService } from '../common/connections/types';
import { ReviewFilterInput } from './dto/review-filter.input';
import { RelationService } from '../common/services/relation.service';

@Injectable()
export class ReviewService
  extends RelationService<Review>
  implements IConnectionService<Review, ReviewFilterInput, never>
{
  constructor(@InjectRepository(Review) repo: EntityRepository<Review>) {
    super(repo);
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
    const em = this.repo.getEntityManager();
    let review: Review;

    try {
      await em.transactional(async (tem) => {
        review = tem.create(Review, { productId, userId, stars, text, createdAt: new Date() });
        await tem.flush();

        const session = tem.getTransactionContext();
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
