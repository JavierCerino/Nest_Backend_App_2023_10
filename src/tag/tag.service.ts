/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { TagEntity } from './tag.entity';

@Injectable()
export class TagService {

    constructor(
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>
    ){}

    async findAll(): Promise<TagEntity[]> {
        return await this.tagRepository.find();
    }

    async findOne(id: string): Promise<TagEntity> {
        const tag = await this.tagRepository.findOne({where: {id}, relations:
            ["clientes","establecimientos"]});

        if(!tag){
            throw new BusinessLogicException('No existe el tag con el tagId: ' + id,BusinessError.NOT_FOUND);
        }
        return tag;
    }

    async create(tag: TagEntity): Promise<TagEntity> {
        return await this.tagRepository.save(tag);
    }

    async update(id: string, tag: TagEntity): Promise<TagEntity> {
        const persistedTag = await this.tagRepository.findOne({where: {id}});
        if (!persistedTag) {
            throw new BusinessLogicException('No existe el tag con el tagId: ' + id,BusinessError.NOT_FOUND);
        }
        return await this.tagRepository.save({ ...persistedTag, ...tag });
    }

    async delete(id: string): Promise<TagEntity> {
        const tag = await this.tagRepository.findOne({where: {id}});
        if (!tag) {
            throw new BusinessLogicException('No existe el tag con el tagId: ' + id,BusinessError.NOT_FOUND);
        }
        return await this.tagRepository.remove(tag);
    }
}