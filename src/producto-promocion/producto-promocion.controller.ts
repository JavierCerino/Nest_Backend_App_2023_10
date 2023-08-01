import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PromocionDto } from 'src/promocion/promocion.dto';
import { PromocionEntity } from 'src/promocion/promocion.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoPromocionService } from './producto-promocion.service';
import { Roles } from '../shared/security/utils/roles.decorator';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../shared/security/utils/role.enum';

@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoPromocionController {
   constructor(private readonly productoPromocionService: ProductoPromocionService){}
   @Roles(Role.ADMIN_PRODUCTO, Role.WRITE_PRODUCTO)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Post(':productoId/promociones/:promocionId')
   async addPromocionProducto(@Param('productoId') productoId: string, @Param('promocionId') promocionId: string){
       return await this.productoPromocionService.addPromocionProducto(productoId, promocionId);
   }
   @Roles(Role.ADMIN_PRODUCTO, Role.READ_PRODUCTO)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Get(':productoId/promociones/:promocionId')
   async findPromocionByProductoIdPromocionId(@Param('productoId') productoId: string, @Param('promocionId') promocionId: string){
       return await this.productoPromocionService.findPromocionByProductoIdPromocionId(productoId, promocionId);
   }
   @Roles(Role.ADMIN_PRODUCTO, Role.READ_PRODUCTO)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Get(':productoId/promociones')
   async findPromocionsByProductoId(@Param('productoId') productoId: string){
       return await this.productoPromocionService.findPromocionsByProductoId(productoId);
   }
   @Roles(Role.ADMIN_PRODUCTO, Role.WRITE_PRODUCTO)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Put(':productoId/promociones')
   async associatePromocionsProducto(@Body() promocionesDto: PromocionDto[], @Param('productoId') productoId: string){
       const promociones = plainToInstance(PromocionEntity, promocionesDto)
       return await this.productoPromocionService.associatePromocionsProducto(productoId, promociones);
   }
   @Roles(Role.ADMIN_PRODUCTO, Role.DELETE_PRODUCTO)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Delete(':productoId/promociones/:promocionId')
    @HttpCode(204)
   async deletePromocionProducto(@Param('productoId') productoId: string, @Param('promocionId') promocionId: string){
       return await this.productoPromocionService.deletePromocionProducto(productoId, promocionId);
   }
}