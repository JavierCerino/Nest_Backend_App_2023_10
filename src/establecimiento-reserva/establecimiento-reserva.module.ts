/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaEntity } from '../reserva/reserva.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { EstablecimientoReservaService } from './establecimiento-reserva.service';
import { EstablecimientoReservaController } from './establecimiento-reserva.controller';

@Module({
  providers: [EstablecimientoReservaService],
  imports: [TypeOrmModule.forFeature([EstablecimientoEntity, ReservaEntity])],
  controllers: [EstablecimientoReservaController],
})
export class EstablecimientoReservaModule {}
