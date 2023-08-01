/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { TagDto } from 'src/tag/tag.dto';
import { TagEntity } from 'src/tag/tag.entity';
import { EstablecimientoTagService } from './establecimiento-tag.service';
import { Role } from '../shared/security/utils/role.enum';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../shared/security/utils/roles.decorator';

@Controller('establecimientos')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstablecimientoTagController {
    constructor(private readonly establecimientoTagService: EstablecimientoTagService) { }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.WRITE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':establecimientoId/tags/:tagId')
    async addTagEstablecimiento(@Param('establecimientoId') establecimientoId: string, @Param('tagId') tagId: string) {
        return await this.establecimientoTagService.addTagEstablecimiento(establecimientoId, tagId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.READ_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':establecimientoId/tags/:tagId')
    async findTagByEstablecimientoIdTagId(@Param('establecimientoId') establecimientoId: string, @Param('tagId') tagId: string) {
        return await this.establecimientoTagService.findTagByEstablecimientoIdTagId(establecimientoId, tagId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.READ_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)    
    @Get(':establecimientoId/tags')
    async findTagsByEstablecimientoId(@Param('establecimientoId') establecimientoId: string) {
        return await this.establecimientoTagService.findTagsByEstablecimientoId(establecimientoId);
    }

    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.WRITE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':establecimientoId/tags')
    async associateTagsEstablecimiento(@Body() tagDto: TagDto[], @Param('establecimientoId') establecimientoId: string) {
        const tag = plainToInstance(TagEntity, tagDto)
        return await this.establecimientoTagService.associateTagsEstablecimiento(establecimientoId, tag);
    }
    
    @Roles(Role.ADMIN_ESTABLECIMIENTO, Role.DELETE_ESTABLECIMIENTO)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':establecimientoId/tags/:tagId')
    @HttpCode(204)
    async deleteTagEstablecimiento(@Param('establecimientoId') establecimientoId: string, @Param('tagId') tagId: string) {
        return await this.establecimientoTagService.deleteTagEstablecimiento(establecimientoId, tagId);
    }
}
