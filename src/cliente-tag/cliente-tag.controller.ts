/* eslint-disable prettier/prettier */
import { Controller, UseGuards, UseInterceptors, Post, Get, Put, Delete, HttpCode, Body, Param } from '@nestjs/common';
import { TagDto } from '../tag/tag.dto';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ClienteTagService } from './cliente-tag.service';
import { TagEntity } from '../tag/tag.entity';
import { Role } from '../shared/security/utils/role.enum';
import { Roles } from '../shared/security/utils/roles.decorator';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('clientes')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClienteTagController {
    constructor(private readonly clienteTagService: ClienteTagService){}

    @Roles(Role.ADMIN_CLIENTE, Role.WRITE_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':clienteId/tags/:tagId')
    async addTagCliente(@Param('clienteId') clienteId: string, @Param('tagId') tagId: string){
        return await this.clienteTagService.addTagCliente(clienteId, tagId);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.READ_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':clienteId/tags/:tagId')
    async findTagByClienteIdTagId(@Param('clienteId') clienteId: string, @Param('tagId') tagId: string){
        return await this.clienteTagService.findTagByClienteIdTagId(clienteId, tagId);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.READ_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':clienteId/tags')
    async findTagsByClienteId(@Param('clienteId') clienteId: string){
        return await this.clienteTagService.findTagsByClienteId(clienteId);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.WRITE_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':clienteId/tags')
    async associateTagsCliente(@Body() tagsDto: TagDto[], @Param('clienteId') clienteId: string){
        const tags = plainToInstance(TagEntity, tagsDto)
        return await this.clienteTagService.associateTagsCliente(clienteId, tags);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.DELETE_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':clienteId/tags/:tagId')
    @HttpCode(204)
    async deleteTagCliente(@Param('clienteId') clienteId: string, @Param('tagId') tagId: string){
        return await this.clienteTagService.deleteTagCliente(clienteId, tagId);
    }
}
