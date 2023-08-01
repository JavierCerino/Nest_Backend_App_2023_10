import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ReservaEntity } from './reserva.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';;

@Injectable()
export class ReservaService {

    constructor(
        @InjectRepository(ReservaEntity)
        private readonly reservaRepository: Repository<ReservaEntity>,

        @InjectRepository(EstablecimientoEntity)
        private readonly establecimientoRepository: Repository<EstablecimientoEntity>,

    ){}

    async findAll(): Promise<ReservaEntity[]> {
        return await this.reservaRepository.find({ relations: ["clientes", "establecimiento", "productos"] });
    }

    async findOne(id: string): Promise<ReservaEntity> {
        const reserva: ReservaEntity = await this.reservaRepository.findOne({where: {id},relations: ["clientes", "establecimiento", "productos"]});
        if (!reserva)
         throw new BusinessLogicException("The reserva with the given id was not found", BusinessError.NOT_FOUND);
  
       return reserva;
    }

    async create(reserva: ReservaEntity, establecimientoId: string): Promise<ReservaEntity> {
        // Se debe validar la creación con un establecimiento valido
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}});
        if (!establecimiento)
            throw new BusinessLogicException("The establecimiento with the given id was not found", BusinessError.NOT_FOUND);
        
        reserva.establecimiento = establecimiento;
        return await this.reservaRepository.save(reserva);
    }

    async update(id: string, reserva: ReservaEntity): Promise<ReservaEntity> {
        const persistedReserva: ReservaEntity = await this.reservaRepository.findOne({where:{id}});
        if (!persistedReserva)
          throw new BusinessLogicException("The reserva with the given id was not found", BusinessError.NOT_FOUND);
        
        reserva.id = id;

        return await this.reservaRepository.save(reserva);
    }

    async delete(id: string): Promise<ReservaEntity> {
        const reserva: ReservaEntity = await this.reservaRepository.findOne({where:{id}});
        if (!reserva)
          throw new BusinessLogicException("The reserva with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.reservaRepository.remove(reserva);
    }
}
