/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdministradorEstablecimientoEntity } from './administrador_establecimiento.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AdministradorEstablecimientoService {
    constructor(
        @InjectRepository(AdministradorEstablecimientoEntity)
        private readonly administradorEstablecimientoRepository: Repository<AdministradorEstablecimientoEntity>
    ){}

    async findAll(): Promise<AdministradorEstablecimientoEntity[]> {
        return await this.administradorEstablecimientoRepository.find({ relations: ["establecimientos"] });
    }

    async findOne(id: string): Promise<AdministradorEstablecimientoEntity> {
        const administradorEstablecimiento: AdministradorEstablecimientoEntity = await this.administradorEstablecimientoRepository.findOne({where: {id}, relations: ["establecimientos"] });
        if (!administradorEstablecimiento)
          throw new BusinessLogicException("The administradorEstablecimiento with the given id was not found", BusinessError.NOT_FOUND);
   
        return administradorEstablecimiento;
    }

    async create(admministradorEstablecimiento: AdministradorEstablecimientoEntity): Promise<AdministradorEstablecimientoEntity> {
        return await this.administradorEstablecimientoRepository.save(admministradorEstablecimiento);
    }

    async update(id: string, administradorEstablecimiento: AdministradorEstablecimientoEntity): Promise<AdministradorEstablecimientoEntity> {
        const persistedAdministradorCliente: AdministradorEstablecimientoEntity = await this.administradorEstablecimientoRepository.findOne({where:{id}});
        if (!persistedAdministradorCliente)
          throw new BusinessLogicException("The administradorEstablecimiento with the given id was not found", BusinessError.NOT_FOUND);
        
          return await this.administradorEstablecimientoRepository.save({...persistedAdministradorCliente, ...administradorEstablecimiento});
    }

    async delete(id: string) {
        const administradorEstablecimiento: AdministradorEstablecimientoEntity = await this.administradorEstablecimientoRepository.findOne({where:{id}});
        if (!administradorEstablecimiento)
          throw new BusinessLogicException("The administradorEstablecimiento with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.administradorEstablecimientoRepository.remove(administradorEstablecimiento);
    }
}
