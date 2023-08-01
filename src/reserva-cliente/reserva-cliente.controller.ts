import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ClienteEntity } from '../cliente/cliente.entity';
import { ClienteDto } from '../cliente/cliente.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ReservaClienteService } from './reserva-cliente.service';
import { Roles } from '../shared/security/utils/roles.decorator';
import { Role } from '../shared/security/utils/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles-auth.guard';

@Controller('reservas')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReservaClienteController {
   constructor(private readonly reservaClienteService: ReservaClienteService){}

   @Roles(Role.ADMIN_RESERVA, Role.WRITE_RESERVA)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Post(':reservaId/clientes/:clienteId')
   async addClienteReserva(@Param('reservaId') reservaId: string, @Param('clienteId') clienteId: string){
       return await this.reservaClienteService.addClienteReserva(reservaId, clienteId);
   }

   @Roles(Role.ADMIN_RESERVA, Role.READ_RESERVA)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Get(':reservaId/clientes/:clienteId')
   async findClienteByReservaIdClienteId(@Param('reservaId') reservaId: string, @Param('clienteId') clienteId: string){
       return await this.reservaClienteService.findClienteByReservaIdClienteId(reservaId, clienteId);
   }

   @Roles(Role.ADMIN_RESERVA, Role.READ_RESERVA)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Get(':reservaId/clientes')
   async findClientesByReservaId(@Param('reservaId') reservaId: string){
       return await this.reservaClienteService.findClientesByReservaId(reservaId);
   }

   @Roles(Role.ADMIN_RESERVA, Role.WRITE_RESERVA)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Put(':reservaId/clientes')
   async associateClientesReserva(@Body() clientesDto: ClienteDto[], @Param('reservaId') reservaId: string){
       const clientes = plainToInstance(ClienteEntity, clientesDto)
       return await this.reservaClienteService.associateClientesReserva(reservaId, clientes);
   }

   @Roles(Role.ADMIN_RESERVA, Role.DELETE_RESERVA)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Delete(':reservaId/clientes/:clienteId')
   @HttpCode(204)
   async deleteClienteReserva(@Param('reservaId') reservaId: string, @Param('clienteId') clienteId: string){
       return await this.reservaClienteService.deleteClienteReserva(reservaId, clienteId);
   }
}
