/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { TagEntity } from '../tag/tag.entity';
import { TagEstablecimientoService } from './tag-establecimiento.service';

@Module({
  providers: [TagEstablecimientoService],
  imports: [TypeOrmModule.forFeature([TagEntity, EstablecimientoEntity])],
  controllers: [TagEstablecimientoModule],
})
export class TagEstablecimientoModule {}
