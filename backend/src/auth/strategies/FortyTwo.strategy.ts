import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: process.env.FORTYTWO_UID,
      clientSecret: process.env.FORTYTWO_SECRET,
      callbackURL: process.env.FORTYTWO_CALLBACK,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
    const user =  {
			oauthId: profile.id,
			username: "",
			fullname: profile.displayName,
			email: profile.emails[0].value,
      avatar: profile._json.image.versions.medium,
      provider: profile.provider,
		}
    done(null, user);
  }
}
