/* eslint-disable prettier/prettier */
import { Controller, Delete, Get, HttpCode, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { TagEstablecimientoService } from './tag-establecimiento.service';
import { Roles } from '../shared/security/utils/roles.decorator';
import { Role } from '../shared/security/utils/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles-auth.guard';

@Controller('tags')
@UseInterceptors(BusinessErrorsInterceptor)
export class TagEstablecimientoController {
    constructor(private readonly tagEstablecimientoService: TagEstablecimientoService) { }

    @Roles(Role.ADMIN_TAG, Role.WRITE_TAG)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':tagId/establecimientos/:establecimientoId')
    async addEstablecimientoTag(@Param('tagId') tagId: string, @Param('establecimientoId') establecimientoId: string) {
        return await this.tagEstablecimientoService.addEstablecimientoTag(tagId, establecimientoId);
    }

    @Roles(Role.ADMIN_TAG, Role.READ_TAG)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':tagId/establecimientos/:establecimientoId')
    async findEstablecimientoByTagIdEstablecimientoId(@Param('tagId') tagId: string, @Param('establecimientoId') establecimientoId: string) {
        return await this.tagEstablecimientoService.findEstablecimientoByTagIdEstablecimientoId(tagId, establecimientoId);
    }

    @Roles(Role.ADMIN_TAG, Role.READ_TAG)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':tagId/establecimientos')
    async findEstablecimientosByTagId(@Param('tagId') tagId: string) {
        return await this.tagEstablecimientoService.findEstablecimientosByTagId(tagId);
    }

    @Roles(Role.ADMIN_TAG, Role.DELETE_TAG)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':tagId/establecimientos/:establecimientoId')
    @HttpCode(204)
    async deleteEstablecimientoTag(@Param('tagId') tagId: string, @Param('establecimientoId') establecimientoId: string) {
        return await this.tagEstablecimientoService.deleteEstablecimientoTag(tagId, establecimientoId);
    }
}
