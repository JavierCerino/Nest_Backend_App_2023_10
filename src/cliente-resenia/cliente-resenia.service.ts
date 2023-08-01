/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClienteEntity } from '../cliente/cliente.entity';
import { ReseniaEntity } from '../resenia/resenia.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ClienteReseniaService {
    constructor(
        @InjectRepository(ClienteEntity)
        private readonly clienteRepository: Repository<ClienteEntity>,
     
        @InjectRepository(ReseniaEntity)
        private readonly reseniaRepository: Repository<ReseniaEntity>
    ) {}

    async addReseniaCliente(clienteId: string, reseniaId: string): Promise<ClienteEntity> {
        const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id: reseniaId}});
        if (!resenia)
          throw new BusinessLogicException("The resenia with the given id was not found", BusinessError.NOT_FOUND);
       
        const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]}) 
        if (!cliente)
          throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND);
     
        cliente.resenias = [...cliente.resenias, resenia];
        return await this.clienteRepository.save(cliente);
    }

    async findReseniaByClienteIdReseniaId(clienteId: string, reseniaId: string): Promise<ReseniaEntity> {
      const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id: reseniaId}});
      if (!resenia)
        throw new BusinessLogicException("The resenia with the given id was not found", BusinessError.NOT_FOUND)
      
      const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]}); 
      if (!cliente)
        throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
  
      const clienteResenia: ReseniaEntity = cliente.resenias.find(e => e.id === resenia.id);
  
      if (!clienteResenia)
        throw new BusinessLogicException("The resenia with the given id is not associated to the cliente", BusinessError.PRECONDITION_FAILED)
  
      return clienteResenia;
    }

    async findReseniasByClienteId(clienteId: string): Promise<ReseniaEntity[]> {
      const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]});
      if (!cliente)
        throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
      
      return cliente.resenias;
    }

    async associateReseniasCliente(clienteId: string, resenias: ReseniaEntity[]): Promise<ClienteEntity> {
      const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]});
   
      if (!cliente)
        throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
   
      for (let i = 0; i < resenias.length; i++) {
        const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id: resenias[i].id}});
        if (!resenia)
          throw new BusinessLogicException("The resenia with the given id was not found", BusinessError.NOT_FOUND)
      }
   
      cliente.resenias = resenias;
      return await this.clienteRepository.save(cliente);
    }

    async deleteReseniaCliente(clienteId: string, reseniaId: string){
      const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id: reseniaId}});
      if (!resenia)
        throw new BusinessLogicException("The resenia with the given id was not found", BusinessError.NOT_FOUND)
   
      const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]});
      if (!cliente)
        throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
   
      const clienteResenia: ReseniaEntity = cliente.resenias.find(e => e.id === resenia.id);
      if (!clienteResenia)
          throw new BusinessLogicException("The resenia with the given id is not associated to the cliente", BusinessError.PRECONDITION_FAILED)

      cliente.resenias = cliente.resenias.filter(e => e.id !== reseniaId);
      await this.clienteRepository.save(cliente);
    }
}
