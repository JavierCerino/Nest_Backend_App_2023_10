/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';

@Controller('users')
export class UserController {

   constructor(private readonly authService: AuthService, private readonly userService: UserService){}
   
   @UseGuards(LocalAuthGuard)
   @Post('login')
   async login(@Req() req) {
       return this.authService.login(req);
   }

   @Get('/create')
   async create() {
        const user = { "nombre":"Hola","contrasenia":"123" };
        console.log(user);
        return this.userService.create(user);
   }

}
