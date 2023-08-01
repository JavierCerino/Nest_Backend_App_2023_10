/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ClienteDto } from 'src/cliente/cliente.dto';
import { ClienteEntity } from 'src/cliente/cliente.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { EstablecimientoClienteService } from './establecimiento-cliente.service';
import { Roles } from '../shared/security/utils/roles.decorator';
import { Role } from '../shared/security/utils/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles-auth.guard';

@Controller('establecimientos')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstablecimientoClienteController {
    constructor(private readonly establecimientoClienteService: EstablecimientoClienteService) { }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.WRITE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':establecimientoId/clientes/:clienteId')
    async addClienteEstablecimiento(@Param('establecimientoId') establecimientoId: string, @Param('clienteId') clienteId: string) {
        return await this.establecimientoClienteService.addClienteEstablecimiento(establecimientoId, clienteId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.READ_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':establecimientoId/clientes/:clienteId')
    async findClienteByEstablecimientoIdClienteId(@Param('establecimientoId') establecimientoId: string, @Param('clienteId') clienteId: string) {
        return await this.establecimientoClienteService.findClienteByEstablecimientoIdClienteId(establecimientoId, clienteId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.READ_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':establecimientoId/clientes')
    async findClientesByEstablecimientoId(@Param('establecimientoId') establecimientoId: string) {
        return await this.establecimientoClienteService.findClientesByEstablecimientoId(establecimientoId);
    }
    
    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.WRITE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':establecimientoId/clientes')
    async associateClientesEstablecimiento(@Body() clientesDto: ClienteDto[], @Param('establecimientoId') establecimientoId: string) {
        const clientes = plainToInstance(ClienteEntity, clientesDto)
        return await this.establecimientoClienteService.associateClientesEstablecimiento(establecimientoId, clientes);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.DELETE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':establecimientoId/clientes/:clienteId')
    @HttpCode(204)
    async deleteClienteEstablecimiento(@Param('establecimientoId') establecimientoId: string, @Param('clienteId') clienteId: string) {
        return await this.establecimientoClienteService.deleteClienteEstablecimiento(establecimientoId, clienteId);
    }
}
