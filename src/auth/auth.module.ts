import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport/dist';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { HashModule } from 'src/hash/hash.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({defaultStrategy: 'jwt' }),
    ConfigModule,
    HashModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_secret') || 'jwt_secret',
      }),
      inject: [ConfigService],
   }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}