/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClienteEntity } from '../cliente/cliente.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ClienteEstablecimientoService {
    constructor(
        @InjectRepository(ClienteEntity)
        private readonly clienteRepository: Repository<ClienteEntity>,
     
        @InjectRepository(EstablecimientoEntity)
        private readonly establecimientoRepository: Repository<EstablecimientoEntity>
    ) {}

    async addEstablecimientoCliente(clienteId: string, establecimientoId: string): Promise<ClienteEntity> {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}});
        if (!establecimiento)
          throw new BusinessLogicException("The establecimiento with the given id was not found", BusinessError.NOT_FOUND);
       
        const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]}) 
        if (!cliente)
          throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND);
     
        cliente.establecimientosFav = [...cliente.establecimientosFav, establecimiento];
        return await this.clienteRepository.save(cliente);
    }

    async findEstablecimientoByClienteIdEstablecimientoId(clienteId: string, establecimientoId: string): Promise<EstablecimientoEntity> {
      const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}});
      if (!establecimiento)
        throw new BusinessLogicException("The establecimiento with the given id was not found", BusinessError.NOT_FOUND)
      
      const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]}); 
      if (!cliente)
        throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
  
      const clienteEstablecimiento: EstablecimientoEntity = cliente.establecimientosFav.find(e => e.id === establecimiento.id);
  
      if (!clienteEstablecimiento)
        throw new BusinessLogicException("The establecimiento with the given id is not associated to the cliente", BusinessError.PRECONDITION_FAILED)
  
      return clienteEstablecimiento;
    }
    
    async findEstablecimientosByClienteId(clienteId: string): Promise<EstablecimientoEntity[]> {
      const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]});
      if (!cliente)
        throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
      
      return cliente.establecimientosFav;
    }

    async associateEstablecimientosCliente(clienteId: string, establecimientos: EstablecimientoEntity[]): Promise<ClienteEntity> {
      const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]});
   
      if (!cliente)
        throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
   
      for (let i = 0; i < establecimientos.length; i++) {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientos[i].id}});
        if (!establecimiento)
          throw new BusinessLogicException("The establecimiento with the given id was not found", BusinessError.NOT_FOUND)
      }
   
      cliente.establecimientosFav = establecimientos;
      return await this.clienteRepository.save(cliente);
    }

    async deleteEstablecimientoCliente(clienteId: string, establecimientoId: string){
      const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}});
      if (!establecimiento)
        throw new BusinessLogicException("The establecimiento with the given id was not found", BusinessError.NOT_FOUND)
   
      const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]});
      if (!cliente)
        throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
   
      const clienteEstablecimiento: EstablecimientoEntity = cliente.establecimientosFav.find(e => e.id === establecimiento.id);
      if (!clienteEstablecimiento)
          throw new BusinessLogicException("The establecimiento with the given id is not associated to the cliente", BusinessError.PRECONDITION_FAILED)

      cliente.establecimientosFav = cliente.establecimientosFav.filter(e => e.id !== establecimientoId);
      await this.clienteRepository.save(cliente);
    }
    
}
