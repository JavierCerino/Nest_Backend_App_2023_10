/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministradorEstablecimientoService } from './administrador_establecimiento.service';
import { AdministradorEstablecimientoEntity } from './administrador_establecimiento.entity';
import { AdministradorEstablecimientoController } from './administrador_establecimiento.controller';

@Module({
  providers: [AdministradorEstablecimientoService],
  imports: [TypeOrmModule.forFeature([AdministradorEstablecimientoEntity])],
  controllers: [AdministradorEstablecimientoController],
})
export class AdministradorEstablecimientoModule {}
