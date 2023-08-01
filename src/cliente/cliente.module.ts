/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from './cliente.entity';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';

@Module({
  providers: [ClienteService],
  imports: [TypeOrmModule.forFeature([ClienteEntity])],
  controllers: [ClienteController]
})
export class ClienteModule {}
