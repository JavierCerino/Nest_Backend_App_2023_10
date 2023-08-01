/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from '../cliente/cliente.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { ReseniaEntity } from './resenia.entity';
import { ReseniaService } from './resenia.service';
import { ReseniaController } from './resenia.controller';

@Module({
    providers: [ReseniaService],
    imports: [TypeOrmModule.forFeature([ReseniaEntity,ClienteEntity,EstablecimientoEntity])],
    controllers: [ReseniaController],
})
export class ReseniaModule {}
