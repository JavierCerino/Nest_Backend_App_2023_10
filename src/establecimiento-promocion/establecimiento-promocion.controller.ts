/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PromocionDto } from 'src/promocion/promocion.dto';
import { PromocionEntity } from 'src/promocion/promocion.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { EstablecimientoPromocionService } from './establecimiento-promocion.service';
import { Role } from '../shared/security/utils/role.enum';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../shared/security/utils/roles.decorator';

@Controller('establecimientos')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstablecimientoPromocionController {
    constructor(private readonly establecimientoPromocionService: EstablecimientoPromocionService) { }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.WRITE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':establecimientoId/promociones/:promocionId')
    async addPromocionEstablecimiento(@Param('establecimientoId') establecimientoId: string, @Param('promocionId') promocionId: string) {
        return await this.establecimientoPromocionService.addPromocionEstablecimiento(establecimientoId, promocionId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.READ_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':establecimientoId/promociones/:promocionId')
    async findPromocionByEstablecimientoIdPromocionId(@Param('establecimientoId') establecimientoId: string, @Param('promocionId') promocionId: string) {
        return await this.establecimientoPromocionService.findPromocionByEstablecimientoIdPromocionId(establecimientoId, promocionId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.READ_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':establecimientoId/promociones')
    async findPromocionsByEstablecimientoId(@Param('establecimientoId') establecimientoId: string) {
        return await this.establecimientoPromocionService.findPromocionsByEstablecimientoId(establecimientoId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.WRITE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':establecimientoId/promociones')
    async associatePromocionsEstablecimiento(@Body() promocionDto: PromocionDto[], @Param('establecimientoId') establecimientoId: string) {
        const promocion = plainToInstance(PromocionEntity, promocionDto)
        return await this.establecimientoPromocionService.associatePromocionsEstablecimiento(establecimientoId, promocion);
    }
    
    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.DELETE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':establecimientoId/promociones/:promocionId')
    @HttpCode(204)
    async deletePromocionEstablecimiento(@Param('establecimientoId') establecimientoId: string, @Param('promocionId') promocionId: string) {
        return await this.establecimientoPromocionService.deletePromocionEstablecimiento(establecimientoId, promocionId);
    }
}
