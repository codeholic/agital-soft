import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mongodb';
import { ObjectId } from '@mikro-orm/mongodb';
import { Review } from './entities/review.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepo: EntityRepository<Review>,
    @InjectRepository(User) private readonly userRepo: EntityRepository<User>,
  ) {}

  async findByProduct(productId: string, stars?: number): Promise<Review[]> {
    const where: Record<string, unknown> = { productId };
    if (stars !== undefined && stars !== null) where['stars'] = stars;
    return this.reviewRepo.findAll({ where, orderBy: { createdAt: 'desc' } });
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
    const review = em.create(Review, { productId, userId, name: user.name, stars, text, createdAt: new Date() });

    try {
      await em.persistAndFlush(review);
    } catch (e: any) {
      if (e.code === 11000) throw new ConflictException('Sie haben dieses Produkt bereits bewertet');
      throw e;
    }

    // Atomic rating update: all three fields in one pipeline operation
    const productCol = em.getDriver().getConnection().getCollection<Product>('product');
    await productCol.updateOne(
      { _id: new ObjectId(productId) },
      [{ $set: {
        'rating.totalStars':    { $add: ['$rating.totalStars', stars] },
        'rating.reviewCount':   { $add: ['$rating.reviewCount', 1] },
        'rating.averageRating': { $divide: [{ $add: ['$rating.totalStars', stars] }, { $add: ['$rating.reviewCount', 1] }] },
      }}],
    );

    return review;
  }
}
