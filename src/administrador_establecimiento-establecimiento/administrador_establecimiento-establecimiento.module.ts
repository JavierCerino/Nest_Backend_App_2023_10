/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministradorEstablecimientoEntity } from '../administrador_establecimiento/administrador_establecimiento.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { AdministradorEstablecimientoEstablecimientoService } from './administrador_establecimiento-establecimiento.service';
import { AdministradorEstablecimientoEstablecimientoController } from './administrador_establecimiento-establecimiento.controller';

@Module({
  providers: [AdministradorEstablecimientoEstablecimientoService],
  imports: [TypeOrmModule.forFeature([EstablecimientoEntity, AdministradorEstablecimientoEntity])],
  controllers: [AdministradorEstablecimientoEstablecimientoController],
})
export class AdministradorEstablecimientoEstablecimientoModule {}
