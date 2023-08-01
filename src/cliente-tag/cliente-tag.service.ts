/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClienteEntity } from '../cliente/cliente.entity';
import { TagEntity } from '../tag/tag.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ClienteTagService {
    constructor(
        @InjectRepository(ClienteEntity)
        private readonly clienteRepository: Repository<ClienteEntity>,
     
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>
    ) {}

    async addTagCliente(clienteId: string, tagId: string): Promise<ClienteEntity> {
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}});
        if (!tag)
          throw new BusinessLogicException("The tag with the given id was not found", BusinessError.NOT_FOUND);
       
        const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]}) 
        if (!cliente)
          throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND);
     
        cliente.tagsCliente = [...cliente.tagsCliente, tag];
        return await this.clienteRepository.save(cliente);
    }

    async findTagByClienteIdTagId(clienteId: string, tagId: string): Promise<TagEntity> {
      const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}});
      if (!tag)
        throw new BusinessLogicException("The tag with the given id was not found", BusinessError.NOT_FOUND)
      
      const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]}); 
      if (!cliente)
        throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
  
      const clienteTag: TagEntity = cliente.tagsCliente.find(e => e.id === tag.id);
  
      if (!clienteTag)
        throw new BusinessLogicException("The tag with the given id is not associated to the cliente", BusinessError.PRECONDITION_FAILED)
  
      return clienteTag;
    }
    
    async findTagsByClienteId(clienteId: string): Promise<TagEntity[]> {
      const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]});
      if (!cliente)
        throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
      
      return cliente.tagsCliente;
    }

    async associateTagsCliente(clienteId: string, tags: TagEntity[]): Promise<ClienteEntity> {
      const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]});
   
      if (!cliente)
        throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
   
      for (let i = 0; i < tags.length; i++) {
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tags[i].id}});
        if (!tag)
          throw new BusinessLogicException("The tag with the given id was not found", BusinessError.NOT_FOUND)
      }
   
      cliente.tagsCliente = tags;
      return await this.clienteRepository.save(cliente);
    }

    async deleteTagCliente(clienteId: string, tagId: string){
      const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}});
      if (!tag)
        throw new BusinessLogicException("The tag with the given id was not found", BusinessError.NOT_FOUND)
   
      const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]});
      if (!cliente)
        throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
   
      const clienteTag: TagEntity = cliente.tagsCliente.find(e => e.id === tag.id);
   
      if (!clienteTag)
          throw new BusinessLogicException("The tag with the given id is not associated to the cliente", BusinessError.PRECONDITION_FAILED)

      cliente.tagsCliente = cliente.tagsCliente.filter(e => e.id !== tagId);
      await this.clienteRepository.save(cliente);
    }
}
