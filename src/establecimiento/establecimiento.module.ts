/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministradorEstablecimientoEntity } from '../administrador_establecimiento/administrador_establecimiento.entity';
import { EstablecimientoEntity } from './establecimiento.entity';
import { EstablecimientoService } from './establecimiento.service';
import { EstablecimientoController } from './establecimiento.controller';

@Module({
  providers: [EstablecimientoService],
  imports: [TypeOrmModule.forFeature([EstablecimientoEntity,AdministradorEstablecimientoEntity])],
  controllers: [EstablecimientoController],

})
export class EstablecimientoModule {}
