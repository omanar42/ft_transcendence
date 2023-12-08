import { BadRequestException, Body, Controller, Get, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AtGuard } from 'src/auth/guards';
import { Response } from 'express';
import { SettingService } from './setting.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('setting')
@ApiTags('Setting')
@UseGuards(AtGuard)
export class SettingController {
  constructor(private readonly settingService : SettingService){}

  @Post('updateUsername')
  @ApiBody({
      schema: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
          },
        },
      },
    })
  async updateUsername(@Req() req, @Res() res: Response, @Body("username") username: string) {
    const message = await this.settingService.updateUsername(req.user.sub, username);
    return res.json(message);
  }

  @Post('updateAvatar')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        const fileName = `${uniqueSuffix}${ext}`;
        return callback(null, fileName);
      },
    }),
    limits: {
      fileSize: 1024 * 1024 * 10,
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(null, false);
      }
      callback(null, true);
    }
  }))
  async updateAvatar(@Req() req, @Res() res: Response, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Only image files are allowed!');
    }
    else {
      const filePath: string = `http://127.0.0.1:3000/users/avatar/${file.filename}`;
      await this.settingService.updateAvatar(req.user.sub, filePath);
      return res.json(filePath);
    }
  }

  @Post('updateProfile')
  @ApiBody({
      schema: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
          },
          fullname: {
            type: 'string',
          },
        },
      },
    })
  async updateProfile(@Req() req, @Res() res: Response, @Body() body: any) {
    const message = await this.settingService.updateProfile(req.user.sub, body);
    return res.json(message);
  }

  @Post('enable2FA')
  async enable2FA(@Req() req, @Res() res: Response) {
    const message = await this.settingService.enable2FA(req.user.sub);
    return res.json(message);
  }

  @Post('disable2FA')
  async disable2FA(@Req() req, @Res() res: Response) {
    const message = await this.settingService.disable2FA(req.user.sub);
    return res.json(message);
  }
}
