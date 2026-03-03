import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mongodb';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'node:crypto';
import { User } from '../user/entities/user.entity';
import { AuthPayload } from './dto/auth-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthPayload | null> {
    const user = await this.userRepo.findOne({ email });
    if (!user) return null;

    const hash = createHash('sha512').update(user.passwordSalt + password).digest('hex');
    if (hash !== user.passwordSha512) return null;

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { token, user };
  }
}
