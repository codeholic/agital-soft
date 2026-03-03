import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload } from './dto/auth-payload.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload, { nullable: true })
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthPayload | null> {
    return this.authService.login(email, password);
  }
}
