import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductoEntity } from '../producto/producto.entity';
import { ProductoDto } from '../producto/producto.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ReservaProductoService } from './reserva-producto.service';
import { Roles } from 'src/shared/security/utils/roles.decorator';
import { Role } from 'src/shared/security/utils/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-auth.guard';

@Controller('reservas')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReservaProductoController {
   constructor(private readonly reservaProductoService: ReservaProductoService){}

   @Roles(Role.ADMIN_RESERVA, Role.WRITE_RESERVA)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Post(':reservaId/productos/:productoId')
   async addProductoReserva(@Param('reservaId') reservaId: string, @Param('productoId') productoId: string){
       return await this.reservaProductoService.addProductoReserva(reservaId, productoId);
   }

   @Roles(Role.ADMIN_RESERVA, Role.READ_RESERVA)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Get(':reservaId/productos/:productoId')
   async findProductoByReservaIdProductoId(@Param('reservaId') reservaId: string, @Param('productoId') productoId: string){
       return await this.reservaProductoService.findProductoByReservaIdProductoId(reservaId, productoId);
   }

   @Roles(Role.ADMIN_RESERVA, Role.READ_RESERVA)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Get(':reservaId/productos')
   async findProductosByReservaId(@Param('reservaId') reservaId: string){
       return await this.reservaProductoService.findProductosByReservaId(reservaId);
   }

   @Roles(Role.ADMIN_RESERVA, Role.WRITE_RESERVA)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Put(':reservaId/productos')
   async associateProductosReserva(@Body() productosDto: ProductoDto[], @Param('reservaId') reservaId: string){
       const productos = plainToInstance(ProductoEntity, productosDto)
       return await this.reservaProductoService.associateProductosReserva(reservaId, productos);
   }

   @Roles(Role.ADMIN_RESERVA, Role.DELETE_RESERVA)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Delete(':reservaId/productos/:productoId')
   @HttpCode(204)
   async deleteProductoReserva(@Param('reservaId') reservaId: string, @Param('productoId') productoId: string){
       return await this.reservaProductoService.deleteProductoReserva(reservaId, productoId);
   }
}

