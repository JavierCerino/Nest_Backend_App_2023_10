/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from '../cliente/cliente.entity';
import { EstablecimientoEntity } from 'src/establecimiento/establecimiento.entity';
import { EstablecimientoClienteService } from './establecimiento-cliente.service';
import { EstablecimientoClienteController } from './establecimiento-cliente.controller';

@Module({
  providers: [EstablecimientoClienteService],
  imports: [TypeOrmModule.forFeature([EstablecimientoEntity, ClienteEntity])],
  controllers: [EstablecimientoClienteController],
})
export class EstablecimientoClienteModule {}
