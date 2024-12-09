import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { envs } from 'src/config/envs';
import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super({
      clientID: envs.google.clientId,
      clientSecret: envs.google.clientSecret,
      callbackURL: envs.google.redirectURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = await this.authService.validateUser({
      email: profile.emails[0].value,
      displayName: profile.displayName,
    });

    console.log(user);

    return user || null;
  }
}
