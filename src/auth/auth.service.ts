/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import constants from '../shared/security/constants';
import { User } from '../users/user';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
   constructor(
       private usersService: UserService,
       private jwtService: JwtService
   ) {}

   async validateUser(username: string, password: string): Promise<any> {
       const user: User = await this.usersService.findOne(username);
       if (user && user.password === password) {
           const { password, ...result } = user;
           return result;
       }
       return null;
   }

   async login(req: any) {
    const payload = { name: req.user.username, sub: req.user.id, roles: req.user.roles };
    return {
        token: this.jwtService.sign(payload, { privateKey: constants.JWT_SECRET }),
        };
    }

}
