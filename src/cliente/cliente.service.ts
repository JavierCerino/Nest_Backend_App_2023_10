/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClienteEntity } from './cliente.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ClienteService {
    constructor(
        @InjectRepository(ClienteEntity)
        private readonly clienteRepository: Repository<ClienteEntity>
    ){}
    
    async findAll(): Promise<ClienteEntity[]> {
        return await this.clienteRepository.find({ relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"] });
    }

    async findOne(id: string): Promise<ClienteEntity> {
        const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"] });
        if (!cliente)
          throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND);
   
        return cliente;
    }

    async create(cliente: ClienteEntity): Promise<ClienteEntity> {
        return await this.clienteRepository.save(cliente);
    }

    async update(id: string, cliente: ClienteEntity): Promise<ClienteEntity> {
        const persistedCliente: ClienteEntity = await this.clienteRepository.findOne({where:{id}});
        if (!persistedCliente)
          throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND);
        
          return await this.clienteRepository.save({...persistedCliente, ...cliente});
    }

    async delete(id: string) {
        const cliente: ClienteEntity = await this.clienteRepository.findOne({where:{id}});
        if (!cliente)
          throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.clienteRepository.remove(cliente);
    }
}
