/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from '../cliente/cliente.entity';
import { TagEntity } from '../tag/tag.entity';
import { TagClienteController } from './tag-cliente.controller';
import { TagClienteService } from './tag-cliente.service';

@Module({
  providers: [TagClienteService],
  imports: [TypeOrmModule.forFeature([TagEntity, ClienteEntity])],
  controllers: [TagClienteController],
})
export class TagClienteModule {}
