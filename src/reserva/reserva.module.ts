/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from '../cliente/cliente.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { ReservaEntity } from './reserva.entity';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';

@Module({
    providers: [ReservaService],
    imports: [TypeOrmModule.forFeature([ReservaEntity,EstablecimientoEntity,ClienteEntity])],
    controllers: [ReservaController],
})
export class ReservaModule {}
