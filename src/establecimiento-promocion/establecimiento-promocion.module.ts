/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromocionEntity } from '../promocion/promocion.entity';
import { EstablecimientoEntity } from 'src/establecimiento/establecimiento.entity';
import { EstablecimientoPromocionService } from './establecimiento-promocion.service';
import { EstablecimientoPromocionController } from './establecimiento-promocion.controller';

@Module({
  providers: [EstablecimientoPromocionService],
  imports: [TypeOrmModule.forFeature([EstablecimientoEntity, PromocionEntity])],
  controllers: [EstablecimientoPromocionController],
})
export class EstablecimientoPromocionModule {}
