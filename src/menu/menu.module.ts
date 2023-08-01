/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuEntity } from './menu.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { MenuController } from './menu.controller';

@Module({
    imports: [TypeOrmModule.forFeature([MenuEntity, EstablecimientoEntity])],
    controllers: [MenuController],
    providers: [MenuService],
})
export class MenuModule {}
