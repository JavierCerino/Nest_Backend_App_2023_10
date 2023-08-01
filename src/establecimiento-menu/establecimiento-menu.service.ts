/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity } from '../menu/menu.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class EstablecimientoMenuService {
    constructor(
        @InjectRepository(EstablecimientoEntity)
        private readonly establecimientoRepository: Repository<EstablecimientoEntity>,
     
        @InjectRepository(MenuEntity)
        private readonly menuRepository: Repository<MenuEntity>
    ) {}

    async addMenuEstablecimiento(establecimientoId: string, menuId: string): Promise<EstablecimientoEntity> {
        const menu: MenuEntity = await this.menuRepository.findOne({where: {id: menuId}});
        if (!menu)
          throw new BusinessLogicException("No existe el menu con el menuId: ", BusinessError.NOT_FOUND);
       
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations:
            ["promociones","resenias","menus","reservas","clientes","menus"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND);
     
        establecimiento.menus = [...establecimiento.menus, menu];
        return await this.establecimientoRepository.save(establecimiento);
      }
     
    async findMenuByEstablecimientoIdMenuId(establecimientoId: string, menuId: string): Promise<MenuEntity> {
        const menu: MenuEntity = await this.menuRepository.findOne({where: {id: menuId}});
        if (!menu)
          throw new BusinessLogicException("No existe el menu con el menuId: ", BusinessError.NOT_FOUND)
        
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["menus"]}); 
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
    
        const establecimientoMenu: MenuEntity = establecimiento.menus.find(e => e.id === menu.id);
    
        if (!establecimientoMenu)
          throw new BusinessLogicException("El  menu con el id dado no esta asociado con el establecimiento", BusinessError.PRECONDITION_FAILED)
    
        return establecimientoMenu;
    }
     
    async findMenusByEstablecimientoId(establecimientoId: string): Promise<MenuEntity[]> {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["menus"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
        
        return establecimiento.menus;
    }
     
    async associateMenusEstablecimiento(establecimientoId: string, menus: MenuEntity[]): Promise<EstablecimientoEntity> {
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["menus"]});
     
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < menus.length; i++) {
          const menu: MenuEntity = await this.menuRepository.findOne({where: {id: menus[i].id}});
          if (!menu)
            throw new BusinessLogicException("No existe el menu con el menuId: ", BusinessError.NOT_FOUND)
        }
     
        establecimiento.menus = menus;
        return await this.establecimientoRepository.save(establecimiento);
      }
     
    async deleteMenuEstablecimiento(establecimientoId: string, menuId: string){
        const menu: MenuEntity = await this.menuRepository.findOne({where: {id: menuId}});
        if (!menu)
          throw new BusinessLogicException("No existe el menu con el menuId: ", BusinessError.NOT_FOUND)
     
        const establecimiento: EstablecimientoEntity = await this.establecimientoRepository.findOne({where: {id: establecimientoId}, relations: ["menus"]});
        if (!establecimiento)
          throw new BusinessLogicException("No existe el establecimiento con el establecimientoId: ", BusinessError.NOT_FOUND)
     
        const establecimientoMenu: MenuEntity = establecimiento.menus.find(e => e.id === menu.id);
     
        if (!establecimientoMenu)
            throw new BusinessLogicException("El  menu con el id dado no esta asociado con el establecimiento", BusinessError.PRECONDITION_FAILED)

        establecimiento.menus = establecimiento.menus.filter(e => e.id !== menuId);
        await this.establecimientoRepository.save(establecimiento);
    }   
}