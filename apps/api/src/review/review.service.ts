import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mongodb';
import { ObjectId } from '@mikro-orm/mongodb';
import { Review } from './entities/review.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { IConnection } from '../common/connections/types';
import { PageInfo } from '../common/connections/dto/page-info.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepo: EntityRepository<Review>,
    @InjectRepository(User) private readonly userRepo: EntityRepository<User>,
  ) {}

  async findByProductConnection(
    productId: string,
    first = 20,
    after?: string,
  ): Promise<IConnection<Review>> {
    const limit = first;
    const offset = after
      ? Number(Buffer.from(after, 'base64url').toString('ascii')) + 1
      : 0;

    const [items, total] = await this.reviewRepo.findAndCount(
      { productId },
      { orderBy: { createdAt: 'desc' }, limit, offset },
    );

    const edges = items.map((node, i) => ({
      cursor: Buffer.from(String(offset + i)).toString('base64url'),
      node,
    }));

    const pageInfo: PageInfo = {
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
      hasNextPage: total > offset + limit,
      hasPreviousPage: offset > 0,
    };

    return { edges, pageInfo, totalCount: total };
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

    // Atomic rating update — $ifNull guards against missing fields in legacy documents
    const productCol = em.getDriver().getConnection().getCollection<Product>('product');
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
    );

    return review;
  }
}
