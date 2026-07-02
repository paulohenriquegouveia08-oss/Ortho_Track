import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (): JwtModuleOptions => ({
  secret: process.env.JWT_SECRET || 'orthotrack-jwt-secret-dev-2026',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRATION || '7d',
  },
});
