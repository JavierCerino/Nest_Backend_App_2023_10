/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { AdministradorEstablecimientoEntity } from '../administrador_establecimiento/administrador_establecimiento.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AdministradorEstablecimientoEstablecimientoService {
    constructor(
        @InjectRepository(EstablecimientoEntity)
        private readonly establecimientoRepository: Repository<EstablecimientoEntity>,
     
        @InjectRepository(AdministradorEstablecimientoEntity)
        private readonly administradorEstablecimientoRepository: Repository<AdministradorEstablecimientoEntity>
    ) {}

    async addEstablecimientoAdministradorEstablecimiento(administradorEstablecimientoId: string, establecimientoId: string): Promise<AdministradorEstablecimientoEntity> {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}});
        if (!establecimiento)
          throw new BusinessLogicException("The establecimiento with the given id was not found", BusinessError.NOT_FOUND);
       
        const administradorEstablecimiento: AdministradorEstablecimientoEntity = await this.administradorEstablecimientoRepository.findOne({where: {id: administradorEstablecimientoId}, relations: ["establecimientos"]}) 
        if (!administradorEstablecimiento)
          throw new BusinessLogicException("The administradorEstablecimiento with the given id was not found", BusinessError.NOT_FOUND);
     
          administradorEstablecimiento.establecimientos = [...administradorEstablecimiento.establecimientos, establecimiento];
        return await this.administradorEstablecimientoRepository.save(administradorEstablecimiento);
    }

    async findEstablecimientoByAdministradorEstablecimientoIdEstablecimientoId(administradorEstablecimientoId: string, establecimientoId: string): Promise<EstablecimientoEntity> {
      const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}});
      if (!establecimiento)
        throw new BusinessLogicException("The establecimiento with the given id was not found", BusinessError.NOT_FOUND)
      
      const administradorEstablecimiento: AdministradorEstablecimientoEntity = await this.administradorEstablecimientoRepository.findOne({where: {id: administradorEstablecimientoId}, relations: ["establecimientos"]}); 
      if (!administradorEstablecimiento)
        throw new BusinessLogicException("The administradorEstablecimiento with the given id was not found", BusinessError.NOT_FOUND)
  
      const administradorEstablecimientoEstablecimiento: EstablecimientoEntity = administradorEstablecimiento.establecimientos.find(e => e.id === establecimiento.id);
  
      if (!administradorEstablecimientoEstablecimiento)
        throw new BusinessLogicException("The establecimiento with the given id is not associated to the administradorEstablecimiento", BusinessError.PRECONDITION_FAILED)
  
      return administradorEstablecimientoEstablecimiento;
    }

    async findEstablecimientosByAdministradorEstablecimientoId(administradorEstablecimientoId: string): Promise<EstablecimientoEntity[]> {
      const administradorEstablecimiento: AdministradorEstablecimientoEntity = await this.administradorEstablecimientoRepository.findOne({where: {id: administradorEstablecimientoId}, relations: ["establecimientos"]});
      if (!administradorEstablecimiento)
        throw new BusinessLogicException("The administradorEstablecimiento with the given id was not found", BusinessError.NOT_FOUND)
      
      return administradorEstablecimiento.establecimientos;
    }

    async associateEstablecimientosAdministradorEstablecimiento(administradorEstablecimientoId: string, establecimientos: EstablecimientoEntity[]): Promise<AdministradorEstablecimientoEntity> {
      const administradorEstablecimiento: AdministradorEstablecimientoEntity = await this.administradorEstablecimientoRepository.findOne({where: {id: administradorEstablecimientoId}, relations: ["establecimientos"]});
   
      if (!administradorEstablecimiento)
        throw new BusinessLogicException("The administradorEstablecimiento with the given id was not found", BusinessError.NOT_FOUND)
   
      for (let i = 0; i < establecimientos.length; i++) {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientos[i].id}});
        if (!establecimiento)
          throw new BusinessLogicException("The establecimiento with the given id was not found", BusinessError.NOT_FOUND)
      }
   
      administradorEstablecimiento.establecimientos = establecimientos;
      return await this.administradorEstablecimientoRepository.save(administradorEstablecimiento);
    }

    async deleteEstablecimientoAdministradorEstablecimiento(administradorEstablecimientoId: string, establecimientoId: string){
      const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}});
      if (!establecimiento)
        throw new BusinessLogicException("The establecimiento with the given id was not found", BusinessError.NOT_FOUND)
   
      const administradorEstablecimiento: AdministradorEstablecimientoEntity = await this.administradorEstablecimientoRepository.findOne({where: {id: administradorEstablecimientoId}, relations: ["establecimientos"]});
      if (!administradorEstablecimiento)
        throw new BusinessLogicException("The administradorEstablecimiento with the given id was not found", BusinessError.NOT_FOUND)
   
      const administradorEstablecimientoEstablecimiento: EstablecimientoEntity = administradorEstablecimiento.establecimientos.find(e => e.id === establecimiento.id);
      if (!administradorEstablecimientoEstablecimiento)
          throw new BusinessLogicException("The establecimiento with the given id is not associated to the administradorEstablecimiento", BusinessError.PRECONDITION_FAILED)

      administradorEstablecimiento.establecimientos = administradorEstablecimiento.establecimientos.filter(e => e.id !== establecimientoId);
      await this.administradorEstablecimientoRepository.save(administradorEstablecimiento);
    }
}
