import { Controller, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const LATEST_VERSION = '1.0.18';
const APK_FILENAME = 'orthotrack-v1.0.18.apk';

@Controller('app')
export class AppVersionController {
  @Get('version')
  getVersion(@Query('current') current?: string) {
    const apkPath = join(__dirname, '..', '..', '..', 'uploads', 'apk', APK_FILENAME);
    const apkExists = existsSync(apkPath);
    return {
      latestVersion: LATEST_VERSION,
      apkUrl: apkExists ? `/app/download` : null,
      apkSize: apkExists ? readFileSync(apkPath).length : 0,
      requiresUpdate: current !== LATEST_VERSION,
    };
  }

  @Get('download')
  downloadApk(@Res() res: Response) {
    const apkPath = join(__dirname, '..', '..', '..', 'uploads', 'apk', APK_FILENAME);
    if (!existsSync(apkPath)) {
      return res.status(404).json({ message: 'APK nao encontrado' });
    }
    res.download(apkPath, APK_FILENAME);
  }
}
