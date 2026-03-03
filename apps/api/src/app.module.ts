import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MongoDriver } from '@mikro-orm/mongodb';
import { join } from 'path';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ...(isProduction ? [
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', '..', 'web', 'dist'),
        exclude: ['/graphql'],
      }),
    ] : []),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: isProduction ? true : join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }: { req: any }) => ({ req }),
    }),
    MikroOrmModule.forRoot({
      driver: MongoDriver,
      clientUrl: process.env.MONGODB_URL,
      dbName: 'agitalsoft',
      entities: ['./dist/**/*.entity.js'],
      entitiesTs: ['./src/**/*.entity.ts'],
    }),
    ProductModule,
    AuthModule,
    ReviewModule,
  ],
})
export class AppModule {}
