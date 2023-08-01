/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClienteEntity } from '../cliente/cliente.entity';
import { TagEntity } from '../tag/tag.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class TagClienteService {
    constructor(
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>,
     
        @InjectRepository(ClienteEntity)
        private readonly clienteRepository: Repository<ClienteEntity>
    ) {}

    async addClienteTag(tagId: string, clienteId: string): Promise<TagEntity> {
        const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}});
        if (!cliente)
          throw new BusinessLogicException("No existe el cliente con el clienteId: ", BusinessError.NOT_FOUND);
       
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}, relations:
            ["clientes","establecimientos"]});
        if (!tag)
          throw new BusinessLogicException("No existe el tag con el tagId: ", BusinessError.NOT_FOUND);
     
        tag.clientes = [...tag.clientes, cliente];
        return await this.tagRepository.save(tag);
      }
     
    async findClienteByTagIdClienteId(tagId: string, clienteId: string): Promise<ClienteEntity> {
        const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}});
        if (!cliente)
          throw new BusinessLogicException("No existe el cliente con el clienteId: ", BusinessError.NOT_FOUND)
        
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}, relations: ["clientes"]}); 
        if (!tag)
          throw new BusinessLogicException("No existe el tag con el tagId: ", BusinessError.NOT_FOUND)
    
        const tagCliente: ClienteEntity = tag.clientes.find(e => e.id === cliente.id);
    
        if (!tagCliente)
          throw new BusinessLogicException("El  cliente con el id dado no esta asociado con el tag", BusinessError.PRECONDITION_FAILED)
    
        return tagCliente;
    }
     
    async findClientesByTagId(tagId: string): Promise<ClienteEntity[]> {
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}, relations: ["clientes"]});
        if (!tag)
          throw new BusinessLogicException("No existe el tag con el tagId: ", BusinessError.NOT_FOUND)
        
        return tag.clientes;
    }
     
    async associateClientesTag(tagId: string, clientes: ClienteEntity[]): Promise<TagEntity> {
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}, relations: ["clientes"]});
     
        if (!tag)
          throw new BusinessLogicException("No existe el tag con el tagId: ", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < clientes.length; i++) {
          const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clientes[i].id}});
          if (!cliente)
            throw new BusinessLogicException("No existe el cliente con el clienteId: ", BusinessError.NOT_FOUND)
        }
     
        tag.clientes = clientes;
        return await this.tagRepository.save(tag);
      }
     
    async deleteClienteTag(tagId: string, clienteId: string){
        const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}});
        if (!cliente)
          throw new BusinessLogicException("No existe el cliente con el clienteId: ", BusinessError.NOT_FOUND)
     
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}, relations: ["clientes"]});
        if (!tag)
          throw new BusinessLogicException("No existe el tag con el tagId: ", BusinessError.NOT_FOUND)
     
        const tagCliente: ClienteEntity = tag.clientes.find(e => e.id === cliente.id);
     
        if (!tagCliente)
            throw new BusinessLogicException("El  cliente con el id dado no esta asociado con el tag", BusinessError.PRECONDITION_FAILED)

        tag.clientes = tag.clientes.filter(e => e.id !== clienteId);
        await this.tagRepository.save(tag);
    }   
}