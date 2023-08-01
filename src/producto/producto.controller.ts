
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoDto } from './producto.dto';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { Roles } from '../shared/security/utils/roles.decorator';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../shared/security/utils/role.enum';

@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)

export class ProductoController 
{
  constructor(private readonly productoService: ProductoService) {}
  @Roles(Role.ADMIN_PRODUCTO, Role.READ_PRODUCTO)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.productoService.findAll();
  }
  @Roles(Role.ADMIN_PRODUCTO, Role.READ_PRODUCTO)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':productoId')
  async findOne(@Param('productoId') productoId: string) {
    return await this.productoService.findOne(productoId);
  }
  @Roles(Role.ADMIN_PRODUCTO, Role.WRITE_PRODUCTO)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() productoDto: ProductoDto) {
    const producto: ProductoEntity = plainToInstance(ProductoEntity, productoDto);
    return await this.productoService.create(producto);
  }
  @Roles(Role.ADMIN_PRODUCTO, Role.WRITE_PRODUCTO)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':productoId')
  async update(@Param('productoId') productoId: string, @Body() productoDto: ProductoDto) {
    const producto: ProductoEntity = plainToInstance(ProductoEntity, productoDto);
    return await this.productoService.update(productoId, producto);
  }
  @Roles(Role.ADMIN_PRODUCTO, Role.DELETE_PRODUCTO)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':productoId')
  @HttpCode(204)
  async delete(@Param('productoId') productoId: string) {
    return await this.productoService.delete(productoId);
  }
}
