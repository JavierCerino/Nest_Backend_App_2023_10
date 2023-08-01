/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuEntity } from '../menu/menu.entity';
import { EstablecimientoEntity } from 'src/establecimiento/establecimiento.entity';
import { EstablecimientoMenuService } from './establecimiento-menu.service';
import { EstablecimientoMenuController } from './establecimiento-menu.controller';

@Module({
  providers: [EstablecimientoMenuService],
  imports: [TypeOrmModule.forFeature([EstablecimientoEntity, MenuEntity])],
  controllers: [EstablecimientoMenuController],
})
export class EstablecimientoMenuModule {}
