/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { ReservaDto } from '../reserva/reserva.dto';
import { ReservaEntity } from '../reserva/reserva.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { EstablecimientoReservaService } from './establecimiento-reserva.service';
import { Role } from '../shared/security/utils/role.enum';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../shared/security/utils/roles.decorator';

@Controller('establecimientos')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstablecimientoReservaController {
    constructor(private readonly establecimientoReservaService: EstablecimientoReservaService) { }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.WRITE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':establecimientoId/reservas/:reservaId')
    async addReservaEstablecimiento(@Param('establecimientoId') establecimientoId: string, @Param('reservaId') reservaId: string) {
        return await this.establecimientoReservaService.addReservaEstablecimiento(establecimientoId, reservaId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.READ_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':establecimientoId/reservas/:reservaId')
    async findReservaByEstablecimientoIdReservaId(@Param('establecimientoId') establecimientoId: string, @Param('reservaId') reservaId: string) {
        return await this.establecimientoReservaService.findReservaByEstablecimientoIdReservaId(establecimientoId, reservaId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.READ_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':establecimientoId/reservas')
    async findReservasByEstablecimientoId(@Param('establecimientoId') establecimientoId: string) {
        return await this.establecimientoReservaService.findReservasByEstablecimientoId(establecimientoId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.WRITE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':establecimientoId/reservas')
    async associateReservasEstablecimiento(@Body() reservaDto: ReservaDto[], @Param('establecimientoId') establecimientoId: string): Promise<EstablecimientoEntity> {
        const reserva = plainToInstance(ReservaEntity, reservaDto)
        return await this.establecimientoReservaService.associateReservasEstablecimiento(establecimientoId, reserva);
    }
    
    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.DELETE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':establecimientoId/reservas/:reservaId')
    @HttpCode(204)
    async deleteReservaEstablecimiento(@Param('establecimientoId') establecimientoId: string, @Param('reservaId') reservaId: string) {
        return await this.establecimientoReservaService.deleteReservaEstablecimiento(establecimientoId, reservaId);
    }
}
