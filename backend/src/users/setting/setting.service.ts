import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as otplib from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) {}

  async updateUsername(id: string, username: string) {
    if (!username) return 'Username cannot be empty';
    console.log(id, username);
    const exist = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (exist) return 'Username already taken';

    await this.prisma.user.update({
      where: {
        oauthId: id,
      },
      data: {
        username: username,
      },
    });
    return 'Username updated';
  }

  async updateAvatar(id: string, filePath: string) {
    await this.prisma.user.update({
      where: {
        oauthId: id,
      },
      data: {
        avatar: filePath,
      },
    });
  }

  async updateProfile(id: string, profile: any) {
    await this.prisma.user.update({
      where: {
        oauthId: id,
      },
      data: {
        username: profile.username,
        fullname: profile.fullname,
      },
    });
    return 'Profile updated';
  }

  async enable2FA(id: string) {
    const user = await this.prisma.user.findUnique({ where: { oauthId: id } });
    if (!user) return 'User not found';
    if (user.twoFactor) return '2FA already enabled';

    const secret = otplib.authenticator.generateSecret();
    await this.prisma.user.update({
      where: { oauthId: id },
      data: {
        twoFactor: true,
        twoFaSec: secret,
      },
    });
    const otpauth = otplib.authenticator.keyuri(
      user.username,
      process.env.TWOFA_APP_NAME,
      secret,
    );
    const qrCodeUrl = await qrcode.toDataURL(otpauth);
    return qrCodeUrl;
  }

  async disable2FA(id: string) {
    const user = await this.prisma.user.findUnique({ where: { oauthId: id } });
    if (!user) return 'User not found';
    if (!user.twoFactor) return '2FA already disabled';
    await this.prisma.user.update({
      where: { oauthId: id },
      data: {
        twoFactor: false,
        twoFaSec: null,
      },
    });
    return '2FA disabled';
  }
}
