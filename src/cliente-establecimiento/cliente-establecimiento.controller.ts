/* eslint-disable prettier/prettier */
import { Controller, UseGuards, UseInterceptors, Post, Get, Put, Delete, HttpCode, Param, Body } from '@nestjs/common';
import { EstablecimientoDto } from '../establecimiento/establecimiento.dto';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ClienteEstablecimientoService } from './cliente-establecimiento.service';
import { EstablecimientoEntity } from 'src/establecimiento/establecimiento.entity';
import { Role } from '../shared/security/utils/role.enum';
import { Roles } from '../shared/security/utils/roles.decorator';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('clientes')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClienteEstablecimientoController {
    constructor(private readonly clienteEstablecimientoService: ClienteEstablecimientoService){}

    @Roles(Role.ADMIN_CLIENTE, Role.WRITE_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':clienteId/establecimientos/:establecimientoId')
    async addEstablecimientoCliente(@Param('clienteId') clienteId: string, @Param('establecimientoId') establecimientoId: string){
        return await this.clienteEstablecimientoService.addEstablecimientoCliente(clienteId, establecimientoId);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.READ_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':clienteId/establecimientos/:establecimientoId')
    async findEstablecimientoByClienteIdEstablecimientoId(@Param('clienteId') clienteId: string, @Param('establecimientoId') establecimientoId: string){
        return await this.clienteEstablecimientoService.findEstablecimientoByClienteIdEstablecimientoId(clienteId, establecimientoId);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.READ_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':clienteId/establecimientos')
    async findEstablecimientosByClienteId(@Param('clienteId') clienteId: string){
        return await this.clienteEstablecimientoService.findEstablecimientosByClienteId(clienteId);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.WRITE_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':clienteId/establecimientos')
    async associateEstablecimientosCliente(@Body() establecimientosDto: EstablecimientoDto[], @Param('clienteId') clienteId: string){
        const establecimientos = plainToInstance(EstablecimientoEntity, establecimientosDto)
        return await this.clienteEstablecimientoService.associateEstablecimientosCliente(clienteId, establecimientos);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.DELETE_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':clienteId/establecimientos/:establecimientoId')
    @HttpCode(204)
    async deleteEstablecimientoCliente(@Param('clienteId') clienteId: string, @Param('establecimientoId') establecimientoId: string){
        return await this.clienteEstablecimientoService.deleteEstablecimientoCliente(clienteId, establecimientoId);
    }
}
