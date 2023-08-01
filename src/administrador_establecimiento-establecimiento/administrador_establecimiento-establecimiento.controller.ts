/* eslint-disable prettier/prettier */
import { UseGuards, Controller, UseInterceptors, Post, Get, Put, Delete, HttpCode, Param, Body } from '@nestjs/common';
import { EstablecimientoDto } from '../establecimiento/establecimiento.dto';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AdministradorEstablecimientoEstablecimientoService } from './administrador_establecimiento-establecimiento.service';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { Role } from '../shared/security/utils/role.enum';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../shared/security/utils/roles.decorator';

@Controller('administradorEstablecimientos')
@UseInterceptors(BusinessErrorsInterceptor)
export class AdministradorEstablecimientoEstablecimientoController {
    constructor(private readonly administradorEstablecimientoEstablecimientoService: AdministradorEstablecimientoEstablecimientoService){}

    @Roles(Role.ADMIN_ADMINISTRADOR_ESTABLECIMIENTO, Role.WRITE_ADMINISTRADOR_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':administradorEstablecimientoId/establecimientos/:establecimientoId')
    async addEstablecimientoAdministradorEstablecimiento(@Param('administradorEstablecimientoId') administradorEstablecimientoId: string, @Param('establecimientoId') establecimientoId: string){
        return await this.administradorEstablecimientoEstablecimientoService.addEstablecimientoAdministradorEstablecimiento(administradorEstablecimientoId, establecimientoId);
    }

    @Roles(Role.ADMIN_ADMINISTRADOR_ESTABLECIMIENTO, Role.READ_ADMINISTRADOR_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':administradorEstablecimientoId/establecimientos/:establecimientoId')
    async findEstablecimientoByAdministradorEstablecimientoIdEstablecimientoId(@Param('administradorEstablecimientoId') administradorEstablecimientoId: string, @Param('establecimientoId') establecimientoId: string){
        return await this.administradorEstablecimientoEstablecimientoService.findEstablecimientoByAdministradorEstablecimientoIdEstablecimientoId(administradorEstablecimientoId, establecimientoId);
    }
    
    @Roles(Role.ADMIN_ADMINISTRADOR_ESTABLECIMIENTO, Role.READ_ADMINISTRADOR_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':administradorEstablecimientoId/establecimientos')
    async findEstablecimientosByAdministradorEstablecimientoId(@Param('administradorEstablecimientoId') administradorEstablecimientoId: string){
        return await this.administradorEstablecimientoEstablecimientoService.findEstablecimientosByAdministradorEstablecimientoId(administradorEstablecimientoId);
    }
    
    @Roles(Role.ADMIN_ADMINISTRADOR_ESTABLECIMIENTO, Role.WRITE_ADMINISTRADOR_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':administradorEstablecimientoId/establecimientos')
    async associateEstablecimientosAdministradorEstablecimientos(@Body() establecimientosDto: EstablecimientoDto[], @Param('administradorEstablecimientoId') administradorEstablecimientoId: string){
        const establecimientos = plainToInstance(EstablecimientoEntity, establecimientosDto)
        return await this.administradorEstablecimientoEstablecimientoService.associateEstablecimientosAdministradorEstablecimiento(administradorEstablecimientoId, establecimientos);
    }

    @Roles(Role.ADMIN_ADMINISTRADOR_ESTABLECIMIENTO, Role.DELETE_ADMINISTRADOR_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':administradorEstablecimientoId/establecimientos/:establecimientoId')
    @HttpCode(204)
    async deleteEstablecimientoAdministradorEstablecimiento(@Param('administradorEstablecimientoId') administradorEstablecimientoId: string, @Param('establecimientoId') establecimientoId: string){
        return await this.administradorEstablecimientoEstablecimientoService.deleteEstablecimientoAdministradorEstablecimiento(administradorEstablecimientoId, establecimientoId);
    }
}
