/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { MenuDto } from 'src/menu/menu.dto';
import { MenuEntity } from 'src/menu/menu.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { EstablecimientoMenuService } from './establecimiento-menu.service';
import { Role } from '../shared/security/utils/role.enum';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../shared/security/utils/roles.decorator';

@Controller('establecimientos')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstablecimientoMenuController {
    constructor(private readonly establecimientoMenuService: EstablecimientoMenuService) { }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.WRITE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':establecimientoId/menus/:menuId')
    async addMenuEstablecimiento(@Param('establecimientoId') establecimientoId: string, @Param('menuId') menuId: string) {
        return await this.establecimientoMenuService.addMenuEstablecimiento(establecimientoId, menuId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.READ_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':establecimientoId/menus/:menuId')
    async findMenuByEstablecimientoIdMenuId(@Param('establecimientoId') establecimientoId: string, @Param('menuId') menuId: string) {
        return await this.establecimientoMenuService.findMenuByEstablecimientoIdMenuId(establecimientoId, menuId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.READ_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':establecimientoId/menus')
    async findMenusByEstablecimientoId(@Param('establecimientoId') establecimientoId: string) {
        return await this.establecimientoMenuService.findMenusByEstablecimientoId(establecimientoId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.WRITE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':establecimientoId/menus')
    async associateMenusEstablecimiento(@Body() menuDto: MenuDto[], @Param('establecimientoId') establecimientoId: string) {
        const menu = plainToInstance(MenuEntity, menuDto)
        return await this.establecimientoMenuService.associateMenusEstablecimiento(establecimientoId, menu);
    }
    
    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.DELETE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':establecimientoId/menus/:menuId')
    @HttpCode(204)
    async deleteMenuEstablecimiento(@Param('establecimientoId') establecimientoId: string, @Param('menuId') menuId: string) {
        return await this.establecimientoMenuService.deleteMenuEstablecimiento(establecimientoId, menuId);
    }
}
