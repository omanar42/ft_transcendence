import { Body, Controller, Get, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AtGuard } from 'src/auth/guards';
import { Response } from 'express';
import { SettingService } from './setting.service';

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
    @UseInterceptors(FileInterceptor('file'))
    async updateAvatar(@UploadedFile() file, @Req() req) {
        const message = await this.settingService.updateAvatar(file, req.user);
        return message;
    }
}
