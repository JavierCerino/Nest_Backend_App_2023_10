/* eslint-disable prettier/prettier */
import { UseGuards, Controller, UseInterceptors, Get, Post, Put, Delete, HttpCode, Body, Param } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { UsuarioDto } from './usuario.dto';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { Role } from '../shared/security/utils/role.enum';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../shared/security/utils/roles.decorator';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('usuarios')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Roles(Role.ADMIN_USUARIO, Role.READ_USUARIO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async findAll() {
        return await this.usuarioService.findAll();
    }
    
    @Get(':usuarioId')
    async findOne(@Param('usuarioId') usuarioId: string) {
        return await this.usuarioService.findOne(usuarioId);
    }

    @Post('login')
    async login(@Body() user:{'nombre','contraseña'}) {
        const name = user.nombre;
        const password = user.contraseña;
        return await this.usuarioService.login(name,password);
    }

    @Post()
    async create(@Body() usuarioDto: UsuarioDto) {
    const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, usuarioDto);
        return await this.usuarioService.create(usuario);
    }

    @Roles(Role.ADMIN_USUARIO, Role.WRITE_USUARIO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':usuarioId')
    async update(@Param('usuarioId') usuarioId: string, @Body() usuarioDto: UsuarioDto) {
    const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, usuarioDto);
        return await this.usuarioService.update(usuarioId, usuario);
    }

    @Roles(Role.ADMIN_USUARIO, Role.DELETE_USUARIO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':usuarioId')
    @HttpCode(204)
    async delete(@Param('usuarioId') usuarioId: string) {
        return await this.usuarioService.delete(usuarioId);
    }
}
