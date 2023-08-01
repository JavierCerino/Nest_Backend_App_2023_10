/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from 'src/cliente/cliente.entity';
import { TagEntity } from 'src/tag/tag.entity';
import { ClienteTagService } from './cliente-tag.service';
import { ClienteTagController } from './cliente-tag.controller';

@Module({
  providers: [ClienteTagService],
  imports: [TypeOrmModule.forFeature([TagEntity, ClienteEntity])],
  controllers: [ClienteTagController],
})
export class ClienteTagModule {}
