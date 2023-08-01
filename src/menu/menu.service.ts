/* eslint-disable prettier/prettier */
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MenuEntity } from '../menu/menu.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class MenuService
{
    constructor
    (
        @InjectRepository(MenuEntity)
        private readonly menuRepository: Repository<MenuEntity>,
    ){}

    async findAll(): Promise<MenuEntity[]>
    {
        return await this.menuRepository.find({relations:['productos']});
    }
    async findOne(id: string): Promise<MenuEntity>
    {
        const menu = await this.menuRepository.findOne({where:{id},relations:['productos']});
        if (!menu) throw new BusinessLogicException('Menu no encontrado', BusinessError.NOT_FOUND);
        return menu;
    }
    async create(menu: MenuEntity): Promise<MenuEntity>
    {
        return await this.menuRepository.save(menu);    
    }
    async update(id: string, menu: MenuEntity): Promise<MenuEntity>
    {
        const peristedMenu: MenuEntity = await this.menuRepository.findOne({where:{id}});
        if (!peristedMenu) throw new BusinessLogicException('Menu no encontrado', BusinessError.NOT_FOUND);
        menu.id = id;
        return await this.menuRepository.save({...peristedMenu, ...menu});
    }
    async delete(id: string): Promise<void>
    {
        const menu: MenuEntity = await this.menuRepository.findOne({where:{id}});
        if (!menu) throw new BusinessLogicException('Menu no encontrado', BusinessError.NOT_FOUND);
        await this.menuRepository.delete(id);
    }

}