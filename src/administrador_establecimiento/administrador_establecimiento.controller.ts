/* eslint-disable prettier/prettier */
import { UseGuards, Controller, UseInterceptors, Get, Post, Put, Body, Delete, HttpCode, Param } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { AdministradorEstablecimientoDto } from './administrador_establecimiento.dto';
import { AdministradorEstablecimientoEntity } from './administrador_establecimiento.entity';
import { AdministradorEstablecimientoService } from './administrador_establecimiento.service';
import { Role } from '../shared/security/utils/role.enum';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../shared/security/utils/roles.decorator';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('administradorEstablecimientos')
export class AdministradorEstablecimientoController {
    constructor(private readonly administradorEstablecimientoService: AdministradorEstablecimientoService) {}

    @Roles(Role.ADMIN_ADMINISTRADOR_ESTABLECIMIENTO, Role.READ_ADMINISTRADOR_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async findAll() {
        return await this.administradorEstablecimientoService.findAll();
    }

    @Roles(Role.ADMIN_ADMINISTRADOR_ESTABLECIMIENTO, Role.READ_ADMINISTRADOR_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':administradorEstablecimientoId')
    async findOne(@Param('administradorEstablecimientoId') administradorEstablecimientoId: string) {
        return await this.administradorEstablecimientoService.findOne(administradorEstablecimientoId);
    }

    @Roles(Role.ADMIN_ADMINISTRADOR_ESTABLECIMIENTO, Role.WRITE_ADMINISTRADOR_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async create(@Body() administradorEstablecimientoDto: AdministradorEstablecimientoDto) {
    const administradorEstablecimiento: AdministradorEstablecimientoEntity = plainToInstance(AdministradorEstablecimientoEntity, administradorEstablecimientoDto);
        return await this.administradorEstablecimientoService.create(administradorEstablecimiento);
    }

    @Roles(Role.ADMIN_ADMINISTRADOR_ESTABLECIMIENTO, Role.WRITE_ADMINISTRADOR_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':administradorEstablecimientoId')
    async update(@Param('administradorEstablecimientoId') administradorEstablecimientoId: string, @Body() administradorEstablecimientoDto: AdministradorEstablecimientoDto) {
    const administradorEstablecimiento: AdministradorEstablecimientoEntity = plainToInstance(AdministradorEstablecimientoEntity, administradorEstablecimientoDto);
        return await this.administradorEstablecimientoService.update(administradorEstablecimientoId, administradorEstablecimiento);
    }

    @Roles(Role.ADMIN_ADMINISTRADOR_ESTABLECIMIENTO, Role.DELETE_ADMINISTRADOR_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':administradorEstablecimientoId')
    @HttpCode(204)
    async delete(@Param('administradorEstablecimientoId') administradorEstablecimientoId: string) {
        return await this.administradorEstablecimientoService.delete(administradorEstablecimientoId);
    }
}