import { Body, Controller, Get, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AtGuard } from 'src/auth/guards';
import { SettingService } from './setting.service';

@Controller('setting')
@ApiTags('Setting')
@UseGuards(AtGuard)
export class SettingController {
    constructor(private readonly settingService : SettingService){}

    @Post('updateUsername')
    async updateUsername(@Body('username') newUsername: string, @Req() req,)
    {
        await this.settingService.updateUsername(newUsername, req.user);
        return true;
    }

    @Post('updateAvatar')
    @UseInterceptors(FileInterceptor('file'))
    async updateAvatar(@UploadedFile() file, @Req() req)
    {
        await this.settingService.updateAvatar(file, req.user);
    }
}
