import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClienteEntity } from '../cliente/cliente.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ReservaEntity } from '../reserva/reserva.entity';

@Injectable()
export class ReservaClienteService {

    constructor(
        @InjectRepository(ReservaEntity)
        private readonly reservaRepository: Repository<ReservaEntity>,
     
        @InjectRepository(ClienteEntity)
        private readonly clienteRepository: Repository<ClienteEntity>
    ) {}

    async addClienteReserva(reservaId: string, clienteId: string): Promise<ReservaEntity> {
        const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}});
        if (!cliente)
          throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND);
       
        const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservaId}, relations: ["clientes", "establecimiento", "clientes"]}) 
        if (!reserva)
          throw new BusinessLogicException("The reserva with the given id was not found", BusinessError.NOT_FOUND);
     
        reserva.clientes = [...reserva.clientes, cliente];
        return await this.reservaRepository.save(reserva);
      }
     
    async findClienteByReservaIdClienteId(reservaId: string, clienteId: string): Promise<ClienteEntity> {
        const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}});
        if (!cliente)
          throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
        
        const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservaId}, relations: ["clientes"]}); 
        if (!reserva)
          throw new BusinessLogicException("The reserva with the given id was not found", BusinessError.NOT_FOUND)
    
        const reservaCliente: ClienteEntity = reserva.clientes.find(e => e.id === cliente.id);
    
        if (!reservaCliente)
          throw new BusinessLogicException("The cliente with the given id is not associated to the reserva", BusinessError.PRECONDITION_FAILED)
    
        return reservaCliente;
    }
     
    async findClientesByReservaId(reservaId: string): Promise<ClienteEntity[]> {
        const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservaId}, relations: ["clientes"]});
        if (!reserva)
          throw new BusinessLogicException("The reserva with the given id was not found", BusinessError.NOT_FOUND)
        
        return reserva.clientes;
    }
     
    async associateClientesReserva(reservaId: string, clientes: ClienteEntity[]): Promise<ReservaEntity> {
        const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservaId}, relations: ["clientes"]});
     
        if (!reserva)
          throw new BusinessLogicException("The reserva with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < clientes.length; i++) {
          const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clientes[i].id}});
          if (!cliente)
            throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        reserva.clientes = clientes;
        return await this.reservaRepository.save(reserva);
      }
     
    async deleteClienteReserva(reservaId: string, clienteId: string){
        const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}});
        if (!cliente)
          throw new BusinessLogicException("The cliente with the given id was not found", BusinessError.NOT_FOUND)
     
        const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservaId}, relations: ["clientes"]});
        if (!reserva)
          throw new BusinessLogicException("The reserva with the given id was not found", BusinessError.NOT_FOUND)
     
        const reservaCliente: ClienteEntity = reserva.clientes.find(e => e.id === cliente.id);
     
        if (!reservaCliente)
            throw new BusinessLogicException("The cliente with the given id is not associated to the reserva", BusinessError.PRECONDITION_FAILED)

        reserva.clientes = reserva.clientes.filter(e => e.id !== clienteId);
        await this.reservaRepository.save(reserva);
    }   
}
