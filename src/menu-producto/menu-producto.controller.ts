import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductoDto } from 'src/producto/producto.dto';
import { ProductoEntity } from 'src/producto/producto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { MenuProductoService } from './menu-producto.service';
import { Roles } from '../shared/security/utils/roles.decorator';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../shared/security/utils/role.enum';

@Controller('menus')
@UseInterceptors(BusinessErrorsInterceptor)
export class MenuProductoController {
   constructor(private readonly menuProductoService: MenuProductoService){}
   @Roles(Role.ADMIN_MENU, Role.WRITE_MENU)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Post(':menuId/productos/:productoId')
   async addProductoMenu(@Param('menuId') menuId: string, @Param('productoId') productoId: string){
       return await this.menuProductoService.addProductoMenu(menuId, productoId);
   }
   @Roles(Role.ADMIN_MENU, Role.READ_MENU)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Get(':menuId/productos/:productoId')
   async findProductoByMenuIdProductoId(@Param('menuId') menuId: string, @Param('productoId') productoId: string){
       return await this.menuProductoService.findProductoByMenuIdProductoId(menuId, productoId);
   }
   @Roles(Role.ADMIN_MENU, Role.READ_MENU)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Get(':menuId/productos')
   async findProductosByMenuId(@Param('menuId') menuId: string){
       return await this.menuProductoService.findProductosByMenuId(menuId);
   }
   @Roles(Role.ADMIN_MENU, Role.WRITE_MENU)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Put(':menuId/productos')
   async associateProductosMenu(@Body() productosDto: ProductoDto[], @Param('menuId') menuId: string){
       const productos = plainToInstance(ProductoEntity, productosDto)
       return await this.menuProductoService.associateProductosMenu(menuId, productos);
   }
   @Roles(Role.ADMIN_MENU, Role.DELETE_MENU)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Delete(':menuId/productos/:productoId')
    @HttpCode(204)
   async deleteProductoMenu(@Param('menuId') menuId: string, @Param('productoId') productoId: string){
       return await this.menuProductoService.deleteProductoMenu(menuId, productoId);
   }
}