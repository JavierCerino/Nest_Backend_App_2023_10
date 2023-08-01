/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AdministradorEstablecimientoEntity } from 'src/administrador_establecimiento/administrador_establecimiento.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { EstablecimientoDto } from './establecimiento.dto';
import { EstablecimientoEntity } from './establecimiento.entity';
import { EstablecimientoService } from './establecimiento.service';
import { Roles } from '../shared/security/utils/roles.decorator';
import { Role } from '../shared/security/utils/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles-auth.guard';


@Controller('establecimientos')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstablecimientoController {
    constructor(
        private readonly establecimientoService: EstablecimientoService,
    ) { }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.READ_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async findAll() {
        return await this.establecimientoService.findAll();
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.READ_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':establecimientoId')
    async findOne(@Param('establecimientoId') establecimientoId: string) {
        return await this.establecimientoService.findOne(establecimientoId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.WRITE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async create(@Body() establecimientoDto: EstablecimientoDto) {
        const establecimiento: EstablecimientoEntity = plainToInstance(EstablecimientoEntity, establecimientoDto);
        const admin: AdministradorEstablecimientoEntity = plainToInstance(AdministradorEstablecimientoEntity, establecimientoDto.adminEst)
        return await this.establecimientoService.create(establecimiento, admin.id);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.WRITE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':establecimientoId')
    async update(@Param('establecimientoId') establecimientoId: string, @Body() establecimientoDto: EstablecimientoDto) {
        const establecimiento: EstablecimientoEntity = plainToInstance(EstablecimientoEntity, establecimientoDto);
        return await this.establecimientoService.update(establecimientoId, establecimiento);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.DELETE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':establecimientoId')
    @HttpCode(204)
    async delete(@Param('establecimientoId') establecimientoId: string) {
        return await this.establecimientoService.delete(establecimientoId);
    }
}
