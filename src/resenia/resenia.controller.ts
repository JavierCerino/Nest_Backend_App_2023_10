/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ClienteEntity } from '../cliente/cliente.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ReseniaDto } from './resenia.dto';
import { ReseniaEntity } from './resenia.entity';
import { ReseniaService } from './resenia.service';
import { Role } from '../shared/security/utils/role.enum';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../shared/security/utils/roles.decorator';

@Controller('resenias')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReseniaController {
    constructor(private readonly reseniaService: ReseniaService) {}

  @Roles(Role.ADMIN_RESENIA, Role.READ_RESENIA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.reseniaService.findAll();
  }

  @Roles(Role.ADMIN_RESENIA, Role.READ_RESENIA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':reseniaId')
  async findOne(@Param('reseniaId') reseniaId: string) {
    return await this.reseniaService.findOne(reseniaId);
  }

  @Roles(Role.ADMIN_RESENIA, Role.WRITE_RESENIA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() reseniaDto: ReseniaDto) {
    const resenia: ReseniaEntity = plainToInstance(ReseniaEntity, reseniaDto);
    const establecimiento: EstablecimientoEntity = plainToInstance(EstablecimientoEntity, reseniaDto.establecimiento);
    const cliente: ClienteEntity = plainToInstance(ClienteEntity, reseniaDto.cliente);
    return await this.reseniaService.create(resenia, cliente.id, establecimiento.id);
  }

  @Roles(Role.ADMIN_RESENIA, Role.WRITE_RESENIA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':reseniaId')
  async update(@Param('reseniaId') reseniaId: string, @Body() reseniaDto: ReseniaDto) {
    const resenia: ReseniaEntity = plainToInstance(ReseniaEntity, reseniaDto);
    return await this.reseniaService.update(reseniaId, resenia);
  }

  @Roles(Role.ADMIN_RESENIA, Role.DELETE_RESENIA)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':reseniaId')
  @HttpCode(204)
  async delete(@Param('reseniaId') reseniaId: string) {
    return await this.reseniaService.delete(reseniaId);
  }
}
