/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservaEntity } from '../reserva/reserva.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class EstablecimientoReservaService {
    constructor(
        @InjectRepository(EstablecimientoEntity)
        private readonly establecimientoRepository: Repository<EstablecimientoEntity>,
     
        @InjectRepository(ReservaEntity)
        private readonly reservaRepository: Repository<ReservaEntity>
    ) {}

    async addReservaEstablecimiento(establecimientoId: string, reservaId: string): Promise<EstablecimientoEntity> {
        const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservaId}});
        if (!reserva)
          throw new BusinessLogicException("No existe el reserva con el reservaId: ", BusinessError.NOT_FOUND);
       
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations:
            ["promociones","resenias","menus","reservas","reservas","tagsEstablecimiento"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND);
     
        establecimiento.reservas = [...establecimiento.reservas, reserva];
        return await this.establecimientoRepository.save(establecimiento);
      }
     
    async findReservaByEstablecimientoIdReservaId(establecimientoId: string, reservaId: string): Promise<ReservaEntity> {
        const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservaId}});
        if (!reserva)
          throw new BusinessLogicException("No existe el reserva con el reservaId: ", BusinessError.NOT_FOUND)
        
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["reservas"]}); 
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
    
        const establecimientoReserva: ReservaEntity = establecimiento.reservas.find(e => e.id === reserva.id);
    
        if (!establecimientoReserva)
          throw new BusinessLogicException("El  reserva con el id dado no esta asociado con el establecimiento", BusinessError.PRECONDITION_FAILED)
    
        return establecimientoReserva;
    }
     
    async findReservasByEstablecimientoId(establecimientoId: string): Promise<ReservaEntity[]> {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["reservas"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
        
        return establecimiento.reservas;
    }
     
    async associateReservasEstablecimiento(establecimientoId: string, reservas: ReservaEntity[]): Promise<EstablecimientoEntity> {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["reservas"]});
     
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < reservas.length; i++) {
          const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservas[i].id}});
          if (!reserva)
            throw new BusinessLogicException("No existe el reserva con el reservaId: ", BusinessError.NOT_FOUND)
        }
     
        establecimiento.reservas = reservas;
        return await this.establecimientoRepository.save(establecimiento);
      }
     
    async deleteReservaEstablecimiento(establecimientoId: string, reservaId: string){
        const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id: reservaId}});
        if (!reserva)
          throw new BusinessLogicException("No existe el reserva con el reservaId: ", BusinessError.NOT_FOUND)
     
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["reservas"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
     
        const establecimientoReserva: ReservaEntity = establecimiento.reservas.find(e => e.id === reserva.id);
     
        if (!establecimientoReserva)
            throw new BusinessLogicException("El  reserva con el id dado no esta asociado con el establecimiento", BusinessError.PRECONDITION_FAILED)

        establecimiento.reservas = establecimiento.reservas.filter(e => e.id !== reservaId);
        await this.establecimientoRepository.save(establecimiento);
    }   
}