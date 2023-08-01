/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from 'src/cliente/cliente.entity';
import { ReseniaEntity } from 'src/resenia/resenia.entity';
import { ClienteReseniaService } from './cliente-resenia.service';
import { ClienteReseniaController } from './cliente-resenia.controller';

@Module({
  providers: [ClienteReseniaService],
  imports: [TypeOrmModule.forFeature([ReseniaEntity, ClienteEntity])],
  controllers: [ClienteReseniaController],
})
export class ClienteReseniaModule {}
