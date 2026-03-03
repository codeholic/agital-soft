import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MongoDriver } from '@mikro-orm/mongodb';
import { join } from 'path';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    MikroOrmModule.forRoot({
      driver: MongoDriver,
      clientUrl: process.env.MONGODB_URL ?? 'mongodb://root:password@localhost:27017/agitalsoft?authSource=admin',
      dbName: 'agitalsoft',
      entities: ['./dist/**/*.entity.js'],
      entitiesTs: ['./src/**/*.entity.ts'],
    }),
  ],
  providers: [AppResolver],
})
export class AppModule {}
