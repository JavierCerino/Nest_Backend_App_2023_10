import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaEntity } from '../reserva/reserva.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { ReservaProductoService } from './reserva-producto.service';
import { ReservaProductoController } from './reserva-producto.controller';

@Module({
  providers: [ReservaProductoService],
  imports: [TypeOrmModule.forFeature([ReservaEntity, ProductoEntity])],
  controllers: [ReservaProductoController],
})
export class ReservaProductoModule {}
