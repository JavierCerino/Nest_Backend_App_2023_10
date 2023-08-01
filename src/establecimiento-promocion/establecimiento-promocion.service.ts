/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromocionEntity } from '../promocion/promocion.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class EstablecimientoPromocionService {
    constructor(
        @InjectRepository(EstablecimientoEntity)
        private readonly establecimientoRepository: Repository<EstablecimientoEntity>,
     
        @InjectRepository(PromocionEntity)
        private readonly promocionRepository: Repository<PromocionEntity>
    ) {}

    async addPromocionEstablecimiento(establecimientoId: string, promocionId: string): Promise<EstablecimientoEntity> {
        const promocion: PromocionEntity = await this.promocionRepository.findOne({where: {id: promocionId}});
        if (!promocion)
          throw new BusinessLogicException("No existe el promocion con el promocionId: ", BusinessError.NOT_FOUND);
       
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations:
            ["promociones","promociones","menus","reservas","clientes","promociones"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND);
     
        establecimiento.promociones = [...establecimiento.promociones, promocion];
        return await this.establecimientoRepository.save(establecimiento);
      }
     
    async findPromocionByEstablecimientoIdPromocionId(establecimientoId: string, promocionId: string): Promise<PromocionEntity> {
        const promocion: PromocionEntity = await this.promocionRepository.findOne({where: {id: promocionId}});
        if (!promocion)
          throw new BusinessLogicException("No existe el promocion con el promocionId: ", BusinessError.NOT_FOUND)
        
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["promociones"]}); 
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
    
        const establecimientoPromocion: PromocionEntity = establecimiento.promociones.find(e => e.id === promocion.id);
    
        if (!establecimientoPromocion)
          throw new BusinessLogicException("El  promocion con el id dado no esta asociado con el establecimiento", BusinessError.PRECONDITION_FAILED)
    
        return establecimientoPromocion;
    }
     
    async findPromocionsByEstablecimientoId(establecimientoId: string): Promise<PromocionEntity[]> {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["promociones"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
        
        return establecimiento.promociones;
    }
     
    async associatePromocionsEstablecimiento(establecimientoId: string, promociones: PromocionEntity[]): Promise<EstablecimientoEntity> {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["promociones"]});
     
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < promociones.length; i++) {
          const promocion: PromocionEntity = await this.promocionRepository.findOne({where: {id: promociones[i].id}});
          if (!promocion)
            throw new BusinessLogicException("No existe el promocion con el promocionId: ", BusinessError.NOT_FOUND)
        }
     
        establecimiento.promociones = promociones;
        return await this.establecimientoRepository.save(establecimiento);
      }
     
    async deletePromocionEstablecimiento(establecimientoId: string, promocionId: string){
        const promocion: PromocionEntity = await this.promocionRepository.findOne({where: {id: promocionId}});
        if (!promocion)
          throw new BusinessLogicException("No existe el promocion con el promocionId: ", BusinessError.NOT_FOUND)
     
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["promociones"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
     
        const establecimientoPromocion: PromocionEntity = establecimiento.promociones.find(e => e.id === promocion.id);
     
        if (!establecimientoPromocion)
            throw new BusinessLogicException("El  promocion con el id dado no esta asociado con el establecimiento", BusinessError.PRECONDITION_FAILED)

        establecimiento.promociones = establecimiento.promociones.filter(e => e.id !== promocionId);
        await this.establecimientoRepository.save(establecimiento);
    }   
}