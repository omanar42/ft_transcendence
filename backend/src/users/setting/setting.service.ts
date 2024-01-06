import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import * as otplib from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) {}

  async updateUsername(id: string, username: string, res: Response) {
    if (!username)
      return res.status(400).json({ message: 'Username required' });
    const exist = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (exist)
      return res.status(400).json({ message: 'Username already exist' });

    await this.prisma.user.update({
      where: {
        oauthId: id,
      },
      data: {
        username: username,
      },
    });
    return res.json({ message: 'Username updated successfully' });
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

  async updateProfile(id: string, profile: any, res: Response) {
    if (!profile.fullname)
      return res.status(400).json({ message: 'Fullname required' });
    if (!profile.username)
      return res.status(400).json({ message: 'Username required' });
    const exist = await this.prisma.user.findUnique({
      where: {
        username: profile.username,
      },
    });
    if (exist)
      return res.status(400).json({ message: 'Username already exist' });
    await this.prisma.user.update({
      where: {
        oauthId: id,
      },
      data: {
        username: profile.username,
        fullname: profile.fullname,
      },
    });
    return res.json({ message: 'Profile updated successfully' });
  }

  async enable2FA(id: string, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { oauthId: id } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.twoFactor)
      return res.status(400).json({ message: '2FA already enabled' });

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
    return res.json({ qrCodeUrl });
  }

  async disable2FA(id: string, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { oauthId: id } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.twoFactor)
      return res.status(400).json({ message: '2FA already disabled' });
    await this.prisma.user.update({
      where: { oauthId: id },
      data: {
        twoFactor: false,
        twoFaSec: null,
      },
    });
    return res.json({ message: '2FA disabled' });
  }
}
