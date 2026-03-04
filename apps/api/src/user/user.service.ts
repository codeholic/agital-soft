import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mongodb';
import { RelationService } from '../common/services/relation.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService extends RelationService<User> {
  constructor(@InjectRepository(User) repo: EntityRepository<User>) {
    super(repo);
  }
}
