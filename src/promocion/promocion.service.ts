import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PromocionEntity } from './promocion.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PromocionService
{
    constructor
    (
        @InjectRepository(PromocionEntity)
        private readonly promocionRepository: Repository<PromocionEntity>,
    ){}

    async findAll(): Promise<PromocionEntity[]>
    {
        return await this.promocionRepository.find();
    }
    async findOne(id: string): Promise<PromocionEntity>
    {
        const promocion = await this.promocionRepository.findOne({where:{id}});
        if (!promocion) throw new BusinessLogicException('Promocion no encontrada', BusinessError.NOT_FOUND);
        return promocion;
    }
    async create(promocion: PromocionEntity): Promise<PromocionEntity>
    {
        return await this.promocionRepository.save(promocion);
    }
    async update(id: string, promocion: PromocionEntity): Promise<PromocionEntity>
    {
        const peristedPromocion: PromocionEntity = await this.promocionRepository.findOne({where:{id}});
        if (!peristedPromocion) throw new BusinessLogicException('Promocion no encontrada', BusinessError.NOT_FOUND);
        promocion.id = id;
        return await this.promocionRepository.save({...peristedPromocion, ...promocion});
    }  
    async delete(id: string): Promise<void>
    {
        const promocion: PromocionEntity = await this.promocionRepository.findOne({where:{id}});
        if (!promocion) throw new BusinessLogicException('Promocion no encontrada', BusinessError.NOT_FOUND);
        await this.promocionRepository.delete(id);
    }
}
