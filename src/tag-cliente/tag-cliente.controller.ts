/* eslint-disable prettier/prettier */
import { Controller, Delete, Get, HttpCode, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { TagClienteService } from './tag-cliente.service';
import { Role } from '../shared/security/utils/role.enum';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../shared/security/utils/roles.decorator';


@Controller('tags')
@UseInterceptors(BusinessErrorsInterceptor)
export class TagClienteController {
    constructor(private readonly tagClienteService: TagClienteService) { }

    @Roles(Role.ADMIN_TAG, Role.WRITE_TAG)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':tagId/clientes/:clienteId')
    async addClienteTag(@Param('tagId') tagId: string, @Param('clienteId') clienteId: string) {
        return await this.tagClienteService.addClienteTag(tagId, clienteId);
    }

    @Roles(Role.ADMIN_TAG, Role.READ_TAG)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':tagId/clientes/:clienteId')
    async findClienteByTagIdClienteId(@Param('tagId') tagId: string, @Param('clienteId') clienteId: string) {
        return await this.tagClienteService.findClienteByTagIdClienteId(tagId, clienteId);
    }

    @Roles(Role.ADMIN_TAG, Role.READ_TAG)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':tagId/clientes')
    async findClientesByTagId(@Param('tagId') tagId: string) {
        return await this.tagClienteService.findClientesByTagId(tagId);
    }

    @Roles(Role.ADMIN_TAG, Role.DELETE_TAG)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':tagId/clientes/:clienteId')
    @HttpCode(204)
    async deleteClienteTag(@Param('tagId') tagId: string, @Param('clienteId') clienteId: string) {
        return await this.tagClienteService.deleteClienteTag(tagId, clienteId);
    }
}
