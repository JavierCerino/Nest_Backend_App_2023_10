/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReseniaEntity } from '../resenia/resenia.entity';
import { EstablecimientoEntity } from 'src/establecimiento/establecimiento.entity';
import { EstablecimientoReseniaService } from './establecimiento-resenia.service';
import { EstablecimientoReseniaController } from './establecimiento-resenia.controller';

@Module({
  providers: [EstablecimientoReseniaService],
  imports: [TypeOrmModule.forFeature([EstablecimientoEntity, ReseniaEntity])],
  controllers: [EstablecimientoReseniaController],
})
export class EstablecimientoReseniaModule {}
