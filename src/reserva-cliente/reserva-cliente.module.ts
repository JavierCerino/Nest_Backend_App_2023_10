/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaEntity } from '../reserva/reserva.entity';
import { ClienteEntity } from '../cliente/cliente.entity';
import { ReservaClienteService } from './reserva-cliente.service';
import { ReservaClienteController } from './reserva-cliente.controller';

@Module({
  providers: [ReservaClienteService],
  imports: [TypeOrmModule.forFeature([ReservaEntity, ClienteEntity])],
  controllers: [ReservaClienteController],
})
export class ReservaClienteModule {}
