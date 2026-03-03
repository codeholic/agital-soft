import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Review } from './entities/review.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Review, Product, User]),
    AuthModule,
  ],
  providers: [ReviewService, ReviewResolver],
})
export class ReviewModule {}
