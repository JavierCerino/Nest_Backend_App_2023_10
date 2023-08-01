/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PromocionService } from './promocion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromocionEntity } from './promocion.entity';
import { ProductoEntity } from 'src/producto/producto.entity';
import { EstablecimientoEntity } from 'src/establecimiento/establecimiento.entity';
import { PromocionController } from './promocion.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PromocionEntity,ProductoEntity,EstablecimientoEntity])],
    controllers: [PromocionController],
    providers: [PromocionService],
})
export class PromocionModule {}
