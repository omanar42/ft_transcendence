import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: 'u-s4t2ud-6cde85231df660415312ae309e4ca5116ca79084036e1fa9e32704910973bc1d',
      clientSecret: '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',
      callbackURL: 'http://127.0.0.1:3000/auth/42/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
    const user =  {
			oauthId: profile.id,
			username: profile.username,
			fullname: profile.displayName,
			email: profile.emails[0].value,
      avatar: profile._json.image.versions.medium,
      provider: profile.provider,
		}
    done(null, user);
  }
}
