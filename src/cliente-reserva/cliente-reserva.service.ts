/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClienteEntity } from '../cliente/cliente.entity';
import { ReservaEntity } from '../reserva/reserva.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ClienteReservaService {
    constructor(
        @InjectRepository(ClienteEntity)
        private readonly clienteRepository: Repository<ClienteEntity>,
     
        @InjectRepository(ReservaEntity)
        private readonly reservaRepository: Repository<ReservaEntity>
    ) {}

    async addReservaCliente(clienteId: string, reservaId: string): Promise<ClienteEntity> {
        const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservaId}});
        if (!reserva)
          throw new BusinessLogicException("The reserva with the given id was not found", BusinessError.NOT_FOUND);
       
        const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]}) 
        if (!cliente)
          throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND);
     
        cliente.reservasAsignadas = [...cliente.reservasAsignadas, reserva];
        return await this.clienteRepository.save(cliente);
    }

    async findReservaByClienteIdReservaId(clienteId: string, reservaId: string): Promise<ReservaEntity> {
      const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservaId}});
      if (!reserva)
        throw new BusinessLogicException("The reserva with the given id was not found", BusinessError.NOT_FOUND)
      
      const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]}); 
      if (!cliente)
        throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
  
      const clienteReserva: ReservaEntity = cliente.reservasAsignadas.find(e => e.id === reserva.id);
  
      if (!clienteReserva)
        throw new BusinessLogicException("The reserva with the given id is not associated to the cliente", BusinessError.PRECONDITION_FAILED)
  
      return clienteReserva;
    }

    async findReservasByClienteId(clienteId: string): Promise<ReservaEntity[]> {
      const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]});
      if (!cliente)
        throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
      
      return cliente.reservasAsignadas;
    }

    async associateReservasCliente(clienteId: string, reservas: ReservaEntity[]): Promise<ClienteEntity> {
      const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]});
   
      if (!cliente)
        throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
   
      for (let i = 0; i < reservas.length; i++) {
        const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservas[i].id}});
        if (!reserva)
          throw new BusinessLogicException("The reserva with the given id was not found", BusinessError.NOT_FOUND)
      }
   
      cliente.reservasAsignadas = reservas;
      return await this.clienteRepository.save(cliente);
    }

    async deleteReservaCliente(clienteId: string, reservaId: string){
      const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservaId}});
      if (!reserva)
        throw new BusinessLogicException("The reserva with the given id was not found", BusinessError.NOT_FOUND)
   
      const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}, relations: ["reservasAsignadas", "resenias", "establecimientosFav", "tagsCliente"]});
      if (!cliente)
        throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
   
      const clienteReserva: ReservaEntity = cliente.reservasAsignadas.find(e => e.id === reserva.id);
   
      if (!clienteReserva)
          throw new BusinessLogicException("The reserva with the given id is not associated to the cliente", BusinessError.PRECONDITION_FAILED)

      cliente.reservasAsignadas = cliente.reservasAsignadas.filter(e => e.id !== reservaId);
      await this.clienteRepository.save(cliente);
    }
}
