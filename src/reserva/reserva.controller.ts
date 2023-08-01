/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Roles } from '../shared/security/utils/roles.decorator';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ReservaDto } from './reserva.dto';
import { ReservaEntity } from './reserva.entity';
import { ReservaService } from './reserva.service';
import { Role } from '../shared/security/utils/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles-auth.guard';

@Controller('reservas')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) { }

  @Roles(Role.ADMIN_RESERVA, Role.READ_RESERVA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.reservaService.findAll();
  }

  @Roles(Role.ADMIN_RESERVA, Role.READ_RESERVA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':reservaId')
  async findOne(@Param('reservaId') reservaId: string) {
    return await this.reservaService.findOne(reservaId);
  }

  @Roles(Role.ADMIN_RESERVA, Role.WRITE_RESERVA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() reservaDto: ReservaDto) {
    const reserva: ReservaEntity = plainToInstance(ReservaEntity, reservaDto);
    const establecimiento: EstablecimientoEntity = plainToInstance(EstablecimientoEntity, reservaDto.establecimiento);
    return await this.reservaService.create(reserva, establecimiento.id);
  }

  @Roles(Role.ADMIN_RESERVA, Role.WRITE_RESERVA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':reservaId')
  async update(@Param('reservaId') reservaId: string, @Body() reservaDto: ReservaDto) {
    const reserva: ReservaEntity = plainToInstance(ReservaEntity, reservaDto);
    return await this.reservaService.update(reservaId, reserva);
  }

  @Roles(Role.ADMIN_RESERVA, Role.DELETE_RESERVA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':reservaId')
  @HttpCode(204)
  async delete(@Param('reservaId') reservaId: string) {
    return await this.reservaService.delete(reservaId);
  }
}
