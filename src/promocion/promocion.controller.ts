import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PromocionDto } from './promocion.dto';
import { PromocionEntity } from './promocion.entity';
import { PromocionService } from './promocion.service';
import { Roles } from '../shared/security/utils/roles.decorator';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../shared/security/utils/role.enum';

@Controller('promociones')
@UseInterceptors(BusinessErrorsInterceptor)

export class PromocionController 
{
  constructor(private readonly promocionService: PromocionService) {}
  @Roles(Role.ADMIN_PROMOCION, Role.READ_PROMOCION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.promocionService.findAll();
  }
  @Roles(Role.ADMIN_PROMOCION, Role.READ_PROMOCION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':promocionId')
  async findOne(@Param('promocionId') promocionId: string) {
    return await this.promocionService.findOne(promocionId);
  }
  @Roles(Role.ADMIN_PROMOCION, Role.WRITE_PROMOCION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() promocionDto: PromocionDto) {
    const promocion: PromocionEntity = plainToInstance(PromocionEntity, promocionDto);
    return await this.promocionService.create(promocion);
  }
  @Roles(Role.ADMIN_PROMOCION, Role.WRITE_PROMOCION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':promocionId')
  async update(@Param('promocionId') promocionId: string, @Body() promocionDto: PromocionDto) {
    const promocion: PromocionEntity = plainToInstance(PromocionEntity, promocionDto);
    return await this.promocionService.update(promocionId, promocion);
  }
  @Roles(Role.ADMIN_PROMOCION, Role.DELETE_PROMOCION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':promocionId')
  @HttpCode(204)
  async delete(@Param('promocionId') promocionId: string) {
    return await this.promocionService.delete(promocionId);
  }
}
