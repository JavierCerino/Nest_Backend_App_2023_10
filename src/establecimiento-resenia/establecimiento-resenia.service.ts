/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReseniaEntity } from '../resenia/resenia.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class EstablecimientoReseniaService {
    constructor(
        @InjectRepository(EstablecimientoEntity)
        private readonly establecimientoRepository: Repository<EstablecimientoEntity>,
     
        @InjectRepository(ReseniaEntity)
        private readonly reseniaRepository: Repository<ReseniaEntity>
    ) {}

    async addReseniaEstablecimiento(establecimientoId: string, reseniaId: string): Promise<EstablecimientoEntity> {
        const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id: reseniaId}});
        if (!resenia)
          throw new BusinessLogicException("No existe el resenia con el reseniaId: ", BusinessError.NOT_FOUND);
       
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations:
            ["promociones","resenias","menus","reservas","clientes","resenias"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND);
     
        establecimiento.resenias = [...establecimiento.resenias, resenia];
        return await this.establecimientoRepository.save(establecimiento);
      }
     
    async findReseniaByEstablecimientoIdReseniaId(establecimientoId: string, reseniaId: string): Promise<ReseniaEntity> {
        const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id: reseniaId}});
        if (!resenia)
          throw new BusinessLogicException("No existe el resenia con el reseniaId: ", BusinessError.NOT_FOUND)
        
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["resenias"]}); 
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
    
        const establecimientoResenia: ReseniaEntity = establecimiento.resenias.find(e => e.id === resenia.id);
    
        if (!establecimientoResenia)
          throw new BusinessLogicException("El  resenia con el id dado no esta asociado con el establecimiento", BusinessError.PRECONDITION_FAILED)
    
        return establecimientoResenia;
    }
     
    async findReseniasByEstablecimientoId(establecimientoId: string): Promise<ReseniaEntity[]> {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["resenias"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
        
        return establecimiento.resenias;
    }
     
    async associateReseniasEstablecimiento(establecimientoId: string, resenias: ReseniaEntity[]): Promise<EstablecimientoEntity> {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["resenias"]});
     
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < resenias.length; i++) {
          const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id: resenias[i].id}});
          if (!resenia)
            throw new BusinessLogicException("No existe el resenia con el reseniaId: ", BusinessError.NOT_FOUND)
        }
     
        establecimiento.resenias = resenias;
        return await this.establecimientoRepository.save(establecimiento);
      }
     
    async deleteReseniaEstablecimiento(establecimientoId: string, reseniaId: string){
        const resenia: ReseniaEntity = await this.reseniaRepository.findOne({where: {id: reseniaId}});
        if (!resenia)
          throw new BusinessLogicException("No existe el resenia con el reseniaId: ", BusinessError.NOT_FOUND)
     
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["resenias"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
     
        const establecimientoResenia: ReseniaEntity = establecimiento.resenias.find(e => e.id === resenia.id);
     
        if (!establecimientoResenia)
            throw new BusinessLogicException("El  resenia con el id dado no esta asociado con el establecimiento", BusinessError.PRECONDITION_FAILED)

        establecimiento.resenias = establecimiento.resenias.filter(e => e.id !== reseniaId);
        await this.establecimientoRepository.save(establecimiento);
    }   
}