/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { EstablecimientoEntity } from './establecimiento.entity';
import { AdministradorEstablecimientoEntity } from '../administrador_establecimiento/administrador_establecimiento.entity';

@Injectable()
export class EstablecimientoService {

    constructor(
        @InjectRepository(EstablecimientoEntity)
        private readonly establecimientoRepository: Repository<EstablecimientoEntity>,

        @InjectRepository(AdministradorEstablecimientoEntity)
        private readonly adminEstablecimientoRepository: Repository<AdministradorEstablecimientoEntity>
    ){}

    async findAll(): Promise<EstablecimientoEntity[]> {
        return await this.establecimientoRepository.find();
    }

    async findOne(id: string): Promise<EstablecimientoEntity> {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id}, relations:
            ["promociones","resenias","menus","reservas","clientes","tagsEstablecimiento"]});

        if(!establecimiento){
            throw new BusinessLogicException('No existe el establecimiento con el establecimientoId: ' + id,BusinessError.NOT_FOUND);
        }
        return establecimiento;
    }

    async create(establecimiento: EstablecimientoEntity, adminEstId: string): Promise<EstablecimientoEntity> {
        const adminEst: AdministradorEstablecimientoEntity = await this.adminEstablecimientoRepository.findOne({where:{id: adminEstId}});
        if (!adminEst)
          throw new BusinessLogicException("No existe el adminEsta con el establecimientoId:", BusinessError.NOT_FOUND);
        return await this.establecimientoRepository.save(establecimiento);
    }

    async update(id: string, establecimiento: EstablecimientoEntity): Promise<EstablecimientoEntity>
    {
        const peristedEstablecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where:{id}});
        if (!peristedEstablecimiento) throw new BusinessLogicException('Establecimiento no encontrado', BusinessError.NOT_FOUND);
        establecimiento.id = id;
        return await this.establecimientoRepository.save({...peristedEstablecimiento, ...establecimiento});
    }
    async delete(id: string): Promise<void>
    {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where:{id}});
        if (!establecimiento) throw new BusinessLogicException('Establecimiento no encontrado', BusinessError.NOT_FOUND);
        await this.establecimientoRepository.delete(id);
    }
}
