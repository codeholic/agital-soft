import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserLoader } from './user.loader';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UserService, UserLoader],
  exports: [UserService, UserLoader],
})
export class UserModule {}
