import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ReseniaEntity } from './resenia.entity';
import { ClienteEntity } from '../cliente/cliente.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';

@Injectable()
export class ReseniaService {

    constructor(
        @InjectRepository(ReseniaEntity)
        private readonly reseniaRepository: Repository<ReseniaEntity>,

        @InjectRepository(ClienteEntity)
        private readonly clienteRepository: Repository<ClienteEntity>,

        @InjectRepository(EstablecimientoEntity)
        private readonly establecimientoRepository: Repository<EstablecimientoEntity>
    ){}

    async findAll(): Promise<ReseniaEntity[]> {
        return await this.reseniaRepository.find({ relations: ["cliente", "establecimientos"] });
    }

    async findOne(id: string): Promise<ReseniaEntity> {
        const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id},relations: ["cliente", "establecimientos"]});
        if (!resenia)
         throw new BusinessLogicException("The resenia with the given id was not found", BusinessError.NOT_FOUND);
  
       return resenia;
    }

    async create(resenia: ReseniaEntity, clienteId: string, establecimientoId: string): Promise<ReseniaEntity> {
        const cliente: ClienteEntity = await this.clienteRepository.findOne({where:{id: clienteId}});
        if (!cliente)
          throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND);

        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where:{id: establecimientoId}});
        if (!establecimiento)
          throw new BusinessLogicException("The establecimiento with the given id was not found", BusinessError.NOT_FOUND);
        
        resenia.cliente = cliente;
        resenia.establecimientos = establecimiento;

        return await this.reseniaRepository.save(resenia);
    }

    async update(id: string, resenia: ReseniaEntity): Promise<ReseniaEntity> {
        const persistedResenia: ReseniaEntity = await this.reseniaRepository.findOne({where:{id}});
        if (!persistedResenia)
          throw new BusinessLogicException("The resenia with the given id was not found", BusinessError.NOT_FOUND);
        
        resenia.id = id;

        return await this.reseniaRepository.save(resenia);
    }

    async delete(id: string): Promise<ReseniaEntity> {
        const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where:{id}});
        if (!resenia)
          throw new BusinessLogicException("The resenia with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.reseniaRepository.remove(resenia);
    }
}
