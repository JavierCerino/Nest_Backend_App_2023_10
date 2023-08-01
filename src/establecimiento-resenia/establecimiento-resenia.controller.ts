/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ReseniaDto } from 'src/resenia/resenia.dto';
import { ReseniaEntity } from 'src/resenia/resenia.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { EstablecimientoReseniaService } from './establecimiento-resenia.service';
import { Role } from '../shared/security/utils/role.enum';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../shared/security/utils/roles.decorator';

@Controller('establecimientos')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstablecimientoReseniaController {
    constructor(private readonly establecimientoReseniaService: EstablecimientoReseniaService) { }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.WRITE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':establecimientoId/resenias/:reseniaId')
    async addReseniaEstablecimiento(@Param('establecimientoId') establecimientoId: string, @Param('reseniaId') reseniaId: string) {
        return await this.establecimientoReseniaService.addReseniaEstablecimiento(establecimientoId, reseniaId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.READ_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':establecimientoId/resenias/:reseniaId')
    async findReseniaByEstablecimientoIdReseniaId(@Param('establecimientoId') establecimientoId: string, @Param('reseniaId') reseniaId: string) {
        return await this.establecimientoReseniaService.findReseniaByEstablecimientoIdReseniaId(establecimientoId, reseniaId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.READ_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':establecimientoId/resenias')
    async findReseniasByEstablecimientoId(@Param('establecimientoId') establecimientoId: string) {
        return await this.establecimientoReseniaService.findReseniasByEstablecimientoId(establecimientoId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.WRITE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':establecimientoId/resenias')
    async associateReseniasEstablecimiento(@Body() reseniaDto: ReseniaDto[], @Param('establecimientoId') establecimientoId: string) {
        const resenia = plainToInstance(ReseniaEntity, reseniaDto)
        return await this.establecimientoReseniaService.associateReseniasEstablecimiento(establecimientoId, resenia);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.DELETE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':establecimientoId/resenias/:reseniaId')
    @HttpCode(204)
    async deleteReseniaEstablecimiento(@Param('establecimientoId') establecimientoId: string, @Param('reseniaId') reseniaId: string) {
        return await this.establecimientoReseniaService.deleteReseniaEstablecimiento(establecimientoId, reseniaId);
    }
}
