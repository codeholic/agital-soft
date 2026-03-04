import { Injectable, Scope } from '@nestjs/common';
import { RelationLoader } from '../common/loaders/relation.loader';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserLoader extends RelationLoader {
  readonly byId = this.createLoaderOne({
    fetch: (ids: readonly string[]) => this.userService.findByIds(ids),
    key: (user: User) => user.id,
  });

  constructor(private readonly userService: UserService) {
    super();
  }
}
