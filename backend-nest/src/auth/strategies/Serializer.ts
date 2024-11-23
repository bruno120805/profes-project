import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super();
  }
  serializeUser(user: User, done) {
    done(null, user);
  }
  async deserializeUser(payload: User, done) {
    const user = await this.authService.findUserById(payload.id);
    return user ? done(null, user) : done(null, false);
  }
}
