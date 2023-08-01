/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClienteEntity } from '../cliente/cliente.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class EstablecimientoClienteService {
    constructor(
        @InjectRepository(EstablecimientoEntity)
        private readonly establecimientoRepository: Repository<EstablecimientoEntity>,
     
        @InjectRepository(ClienteEntity)
        private readonly clienteRepository: Repository<ClienteEntity>
    ) {}

    async addClienteEstablecimiento(establecimientoId: string, clienteId: string): Promise<EstablecimientoEntity> {
        const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}});
        if (!cliente)
          throw new BusinessLogicException("No existe el cliente con el clienteId: ", BusinessError.NOT_FOUND);
       
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations:
            ["promociones","resenias","menus","reservas","clientes","tagsEstablecimiento"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND);
     
        establecimiento.clientes = [...establecimiento.clientes, cliente];
        return await this.establecimientoRepository.save(establecimiento);
      }
     
    async findClienteByEstablecimientoIdClienteId(establecimientoId: string, clienteId: string): Promise<ClienteEntity> {
        const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}});
        if (!cliente)
          throw new BusinessLogicException("No existe el cliente con el clienteId: ", BusinessError.NOT_FOUND)
        
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["clientes"]}); 
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
    
        const establecimientoCliente: ClienteEntity = establecimiento.clientes.find(e => e.id === cliente.id);
    
        if (!establecimientoCliente)
          throw new BusinessLogicException("El  cliente con el id dado no esta asociado con el establecimiento", BusinessError.PRECONDITION_FAILED)
    
        return establecimientoCliente;
    }
     
    async findClientesByEstablecimientoId(establecimientoId: string): Promise<ClienteEntity[]> {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["clientes"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
        
        return establecimiento.clientes;
    }
     
    async associateClientesEstablecimiento(establecimientoId: string, clientes: ClienteEntity[]): Promise<EstablecimientoEntity> {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["clientes"]});
     
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < clientes.length; i++) {
          const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clientes[i].id}});
          if (!cliente)
            throw new BusinessLogicException("No existe el cliente con el clienteId: ", BusinessError.NOT_FOUND)
        }
     
        establecimiento.clientes = clientes;
        return await this.establecimientoRepository.save(establecimiento);
      }
     
    async deleteClienteEstablecimiento(establecimientoId: string, clienteId: string){
        const cliente: ClienteEntity = await this.clienteRepository.findOne({where: {id: clienteId}});
        if (!cliente)
          throw new BusinessLogicException("No existe el cliente con el clienteId: ", BusinessError.NOT_FOUND)
     
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["clientes"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
     
        const establecimientoCliente: ClienteEntity = establecimiento.clientes.find(e => e.id === cliente.id);
     
        if (!establecimientoCliente)
            throw new BusinessLogicException("El  cliente con el id dado no esta asociado con el establecimiento", BusinessError.PRECONDITION_FAILED)

        establecimiento.clientes = establecimiento.clientes.filter(e => e.id !== clienteId);
        await this.establecimientoRepository.save(establecimiento);
    }   
}