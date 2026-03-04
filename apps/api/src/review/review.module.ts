import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Review } from './entities/review.entity';
import { Product } from '../product/entities/product.entity';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Review, Product]),
    UserModule,
    AuthModule,
  ],
  providers: [ReviewService, ReviewResolver],
})
export class ReviewModule {}
