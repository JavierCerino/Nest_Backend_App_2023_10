import { Module } from '@nestjs/common';
import { ProductoEntity } from 'src/producto/producto.entity';
import { PromocionEntity } from 'src/promocion/promocion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoPromocionService } from './producto-promocion.service';
import { ProductoPromocionController } from './producto-promocion.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ProductoEntity, PromocionEntity])],
    controllers: [ProductoPromocionController],
    providers: [ProductoPromocionService],
})
export class ProductoPromocionModule { }
