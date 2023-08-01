/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from 'src/cliente/cliente.entity';
import { EstablecimientoEntity } from 'src/establecimiento/establecimiento.entity';
import { ClienteEstablecimientoService } from './cliente-establecimiento.service';
import { ClienteEstablecimientoController } from './cliente-establecimiento.controller';

@Module({
  providers: [ClienteEstablecimientoService],
  imports: [TypeOrmModule.forFeature([EstablecimientoEntity, ClienteEntity])],
  controllers: [ClienteEstablecimientoController],
})
export class ClienteEstablecimientoModule {}
