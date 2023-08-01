import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer'
import { ProductoDto } from 'src/producto/producto.dto';
import { ProductoEntity } from 'src/producto/producto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PromocionProductoService } from './promocion-producto.service';
import { Roles } from '../shared/security/utils/roles.decorator';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../shared/security/utils/role.enum';

@Controller('promociones')
@UseInterceptors(BusinessErrorsInterceptor)
export class PromocionProductoController {
   constructor(private readonly promocionProductoService: PromocionProductoService){}
   @Roles(Role.ADMIN_PROMOCION, Role.WRITE_PROMOCION)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Post(':promocionId/productos/:productoId')
   async addProductoPromocion(@Param('promocionId') promocionId: string, @Param('productoId') productoId: string){
       return await this.promocionProductoService.addProductoPromocion(promocionId, productoId);
   }
   @Roles(Role.ADMIN_PROMOCION, Role.READ_PROMOCION)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Get(':promocionId/productos/:productoId')
   async findProductoByPromocionIdProductoId(@Param('promocionId') promocionId: string, @Param('productoId') productoId: string){
       return await this.promocionProductoService.findProductoByPromocionIdProductoId(promocionId, productoId);
   }
   @Roles(Role.ADMIN_PROMOCION, Role.READ_PROMOCION)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Get(':promocionId/productos')
   async findProductosByPromocionId(@Param('promocionId') promocionId: string){
       return await this.promocionProductoService.findProductosByPromocionId(promocionId);
   }
   @Roles(Role.ADMIN_PROMOCION, Role.WRITE_PROMOCION)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Put(':promocionId/productos')
   async associateProductosPromocion(@Body() productosDto: ProductoDto[], @Param('promocionId') promocionId: string){
       const productos = plainToInstance(ProductoEntity, productosDto)
       return await this.promocionProductoService.associateProductosPromocion(promocionId, productos);
   }
   @Roles(Role.ADMIN_PROMOCION, Role.DELETE_PROMOCION)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Delete(':promocionId/productos/:productoId')
    @HttpCode(204)
   async deleteProductoPromocion(@Param('promocionId') promocionId: string, @Param('productoId') productoId: string){
       return await this.promocionProductoService.deleteProductoPromocion(promocionId, productoId);
   }
}