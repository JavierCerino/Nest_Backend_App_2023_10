/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { MenuDto } from './menu.dto';
import { MenuEntity } from './menu.entity';
import { MenuService } from './menu.service';
import { Roles } from '../shared/security/utils/roles.decorator';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../shared/security/utils/role.enum';

@Controller('menus')
@UseInterceptors(BusinessErrorsInterceptor)

export class MenuController 

{
  constructor(private readonly menuService: MenuService) { }

  @Roles(Role.ADMIN_MENU, Role.READ_MENU)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.menuService.findAll();
  }

  @Roles(Role.ADMIN_MENU, Role.READ_MENU)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':menuId')
  async findOne(@Param('menuId') menuId: string) {
    return await this.menuService.findOne(menuId);
  }

  @Roles(Role.ADMIN_MENU, Role.WRITE_MENU)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() menuDto: MenuDto) {
    const menu: MenuEntity = plainToInstance(MenuEntity, menuDto);
    return await this.menuService.create(menu);
  }

  @Roles(Role.ADMIN_MENU, Role.WRITE_MENU)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':menuId')
  async update(@Param('menuId') menuId: string, @Body() menuDto: MenuDto) {
    const menu: MenuEntity = plainToInstance(MenuEntity, menuDto);
    return await this.menuService.update(menuId, menu);
  }

  @Roles(Role.ADMIN_MENU, Role.DELETE_MENU)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':menuId')
  @HttpCode(204)
  async delete(@Param('menuId') menuId: string) {
    return await this.menuService.delete(menuId);
  }

}
