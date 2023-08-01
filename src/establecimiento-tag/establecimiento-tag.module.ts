/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from '../tag/tag.entity';
import { EstablecimientoEntity } from 'src/establecimiento/establecimiento.entity';
import { EstablecimientoTagService } from './establecimiento-tag.service';
import { EstablecimientoTagController } from './establecimiento-tag.controller';

@Module({
  providers: [EstablecimientoTagService],
  imports: [TypeOrmModule.forFeature([EstablecimientoEntity, TagEntity])],
  controllers: [EstablecimientoTagController],
})
export class EstablecimientoTagModule {}
