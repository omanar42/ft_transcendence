import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
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
  constructor(private readonly settingService: SettingService) {}

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
  async updateUsername(
    @Req() req: any,
    @Res() res: Response,
    @Body('username') username: string,
  ) {
    return await this.settingService.updateUsername(
      req.user.sub,
      username,
      res,
    );
  }

  @Post('updateAvatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const fileName = `${uniqueSuffix}${ext}`;
          return callback(null, fileName);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 10,
      },
      fileFilter: (req: any, file: Express.Multer.File, callback: any) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(null, false);
        }
        callback(null, true);
      },
    }),
  )
  async updateAvatar(
    @Req() req: any,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      return res.status(400).json({ message: 'File required' });
    } else {
      const filePath: string = `http://127.0.0.1:3000/users/avatar/${file.filename}`;
      await this.settingService.updateAvatar(req.user.sub, filePath);
      return res.json({ message: 'Avatar updated' });
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
  async updateProfile(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: any,
  ) {
    return await this.settingService.updateProfile(req.user.sub, body, res);
  }

  @Post('enable2FA')
  async enable2FA(@Req() req: any, @Res() res: Response) {
    return await this.settingService.enable2FA(req.user.sub, res);
  }

  @Post('disable2FA')
  async disable2FA(@Req() req: any, @Res() res: Response) {
    return await this.settingService.disable2FA(req.user.sub, res);
  }
}
