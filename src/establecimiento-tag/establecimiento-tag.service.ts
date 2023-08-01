/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from '../tag/tag.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class EstablecimientoTagService {
    constructor(
        @InjectRepository(EstablecimientoEntity)
        private readonly establecimientoRepository: Repository<EstablecimientoEntity>,
     
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>
    ) {}

    async addTagEstablecimiento(establecimientoId: string, tagId: string): Promise<EstablecimientoEntity> {
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}});
        if (!tag)
          throw new BusinessLogicException("No existe el tag con el tagId: ", BusinessError.NOT_FOUND);
       
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations:
            ["promociones","resenias","menus","reservas","clientes","tagsEstablecimiento"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND);
     
        establecimiento.tagsEstablecimiento = [...establecimiento.tagsEstablecimiento, tag];
        return await this.establecimientoRepository.save(establecimiento);
      }
     
    async findTagByEstablecimientoIdTagId(establecimientoId: string, tagId: string): Promise<TagEntity> {
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}});
        if (!tag)
          throw new BusinessLogicException("No existe el tag con el tagId: ", BusinessError.NOT_FOUND)
        
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["tagsEstablecimiento"]}); 
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
    
        const establecimientoTag: TagEntity = establecimiento.tagsEstablecimiento.find(e => e.id === tag.id);
    
        if (!establecimientoTag)
          throw new BusinessLogicException("El  tag con el id dado no esta asociado con el establecimiento", BusinessError.PRECONDITION_FAILED)
    
        return establecimientoTag;
    }
     
    async findTagsByEstablecimientoId(establecimientoId: string): Promise<TagEntity[]> {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["tagsEstablecimiento"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
        
        return establecimiento.tagsEstablecimiento;
    }
     
    async associateTagsEstablecimiento(establecimientoId: string, tags: TagEntity[]): Promise<EstablecimientoEntity> {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["tagsEstablecimiento"]});
     
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < tags.length; i++) {
          const tag: TagEntity = await this.tagRepository.findOne({where: {id: tags[i].id}});
          if (!tag)
            throw new BusinessLogicException("No existe el tag con el tagId: ", BusinessError.NOT_FOUND)
        }
     
        establecimiento.tagsEstablecimiento = tags;
        return await this.establecimientoRepository.save(establecimiento);
      }
     
    async deleteTagEstablecimiento(establecimientoId: string, tagId: string){
        const tag: TagEntity = await this.tagRepository.findOne({where: {id: tagId}});
        if (!tag)
          throw new BusinessLogicException("No existe el tag con el tagId: ", BusinessError.NOT_FOUND)
     
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["tagsEstablecimiento"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
     
        const establecimientoTag: TagEntity = establecimiento.tagsEstablecimiento.find(e => e.id === tag.id);
     
        if (!establecimientoTag)
            throw new BusinessLogicException("El  tag con el id dado no esta asociado con el establecimiento", BusinessError.PRECONDITION_FAILED)

        establecimiento.tagsEstablecimiento = establecimiento.tagsEstablecimiento.filter(e => e.id !== tagId);
        await this.establecimientoRepository.save(establecimiento);
    }   
}