/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';
import { UserController } from './users.controller';

@Module({
  providers: [UserService, AuthService, JwtService],
  controllers: [UserController]
})
export class UserModule {}
