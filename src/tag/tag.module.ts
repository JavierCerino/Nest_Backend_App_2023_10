/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagController } from './tag.controller';
import { TagEntity } from './tag.entity';
import { TagService } from './tag.service';

@Module({
  providers: [TagService],
  imports: [TypeOrmModule.forFeature([TagEntity])],
  controllers : [TagController]
})
export class TagModule {}
