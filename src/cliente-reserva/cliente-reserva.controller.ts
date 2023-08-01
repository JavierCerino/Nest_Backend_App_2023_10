/* eslint-disable prettier/prettier */
import { Controller, UseGuards, UseInterceptors, Post, Get, Put, Delete, HttpCode, Param, Body } from '@nestjs/common';
import { ReservaDto } from '../reserva/reserva.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { ClienteReservaService } from './cliente-reserva.service';
import { ReservaEntity } from 'src/reserva/reserva.entity';
import { Role } from '../shared/security/utils/role.enum';
import { Roles } from '../shared/security/utils/roles.decorator';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('clientes')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClienteReservaController {
    constructor(private readonly clienteReservaService: ClienteReservaService){}
    
    @Roles(Role.ADMIN_CLIENTE, Role.WRITE_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':clienteId/reservas/:reservaId')
    async addReservaCliente(@Param('clienteId') clienteId: string, @Param('reservaId') reservaId: string){
        return await this.clienteReservaService.addReservaCliente(clienteId, reservaId);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.READ_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':clienteId/reservas/:reservaId')
    async findReservaByClienteIdReservaId(@Param('clienteId') clienteId: string, @Param('reservaId') reservaId: string){
        return await this.clienteReservaService.findReservaByClienteIdReservaId(clienteId, reservaId);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.READ_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':clienteId/reservas')
    async findReservasByClienteId(@Param('clienteId') clienteId: string){
        return await this.clienteReservaService.findReservasByClienteId(clienteId);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.WRITE_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':clienteId/reservas')
    async associateReservasCliente(@Body() reservasDto: ReservaDto[], @Param('clienteId') clienteId: string){
        const reservas = plainToInstance(ReservaEntity, reservasDto)
        return await this.clienteReservaService.associateReservasCliente(clienteId, reservas);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.DELETE_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':clienteId/reservas/:reservaId')
    @HttpCode(204)
    async deleteReservaCliente(@Param('clienteId') clienteId: string, @Param('reservaId') reservaId: string){
        return await this.clienteReservaService.deleteReservaCliente(clienteId, reservaId);
    }
}
