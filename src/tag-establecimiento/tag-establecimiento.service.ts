/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { TagEntity } from '../tag/tag.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class TagEstablecimientoService {
    constructor(
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>,
     
        @InjectRepository(EstablecimientoEntity)
        private readonly establecimientoRepository: Repository<EstablecimientoEntity>
    ) {}

    async addEstablecimientoTag(tagId: string, establecimientoId: string): Promise<TagEntity> {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND);
       
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}, relations:
            ["establecimientos","establecimientos"]});
        if (!tag)
          throw new BusinessLogicException("No existe el tag con el tagId: ", BusinessError.NOT_FOUND);
     
        tag.establecimientos = [...tag.establecimientos, establecimiento];
        return await this.tagRepository.save(tag);
      }
     
    async findEstablecimientoByTagIdEstablecimientoId(tagId: string, establecimientoId: string): Promise<EstablecimientoEntity> {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
        
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}, relations: ["establecimientos"]}); 
        if (!tag)
          throw new BusinessLogicException("No existe el tag con el tagId: ", BusinessError.NOT_FOUND)
    
        const tagEstablecimiento: EstablecimientoEntity = tag.establecimientos.find(e => e.id === establecimiento.id);
    
        if (!tagEstablecimiento)
          throw new BusinessLogicException("El  establecimiento con el id dado no esta asociado con el tag", BusinessError.PRECONDITION_FAILED)
    
        return tagEstablecimiento;
    }
     
    async findEstablecimientosByTagId(tagId: string): Promise<EstablecimientoEntity[]> {
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}, relations: ["establecimientos"]});
        if (!tag)
          throw new BusinessLogicException("No existe el tag con el tagId: ", BusinessError.NOT_FOUND)
        
        return tag.establecimientos;
    }
     
    async associateEstablecimientosTag(tagId: string, establecimientos: EstablecimientoEntity[]): Promise<TagEntity> {
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}, relations: ["establecimientos"]});
     
        if (!tag)
          throw new BusinessLogicException("No existe el tag con el tagId: ", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < establecimientos.length; i++) {
          const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientos[i].id}});
          if (!establecimiento)
            throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
        }
     
        tag.establecimientos = establecimientos;
        return await this.tagRepository.save(tag);
      }
     
    async deleteEstablecimientoTag(tagId: string, establecimientoId: string){
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
     
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}, relations: ["establecimientos"]});
        if (!tag)
          throw new BusinessLogicException("No existe el tag con el tagId: ", BusinessError.NOT_FOUND)
     
        const tagEstablecimiento: EstablecimientoEntity = tag.establecimientos.find(e => e.id === establecimiento.id);
     
        if (!tagEstablecimiento)
            throw new BusinessLogicException("El  establecimiento con el id dado no esta asociado con el tag", BusinessError.PRECONDITION_FAILED)

        tag.establecimientos = tag.establecimientos.filter(e => e.id !== establecimientoId);
        await this.tagRepository.save(tag);
    }   
}