/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from 'src/cliente/cliente.entity';
import { ReservaEntity } from 'src/reserva/reserva.entity';
import { ClienteReservaService } from './cliente-reserva.service';
import { ClienteReservaController } from './cliente-reserva.controller';

@Module({
  providers: [ClienteReservaService],
  imports: [TypeOrmModule.forFeature([ClienteEntity, ReservaEntity])],
  controllers: [ClienteReservaController],
})
export class ClienteReservaModule {}
