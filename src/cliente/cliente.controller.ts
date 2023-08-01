/* eslint-disable prettier/prettier */
import { Controller, UseGuards, UseInterceptors, Get, Post, Put, Delete, HttpCode, Body, Param } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { ClienteDto } from './cliente.dto';
import { ClienteEntity } from './cliente.entity';
import { ClienteService } from './cliente.service'; 
import { Role } from '../shared/security/utils/role.enum';
import { Roles } from '../shared/security/utils/roles.decorator';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('clientes')
export class ClienteController {
    constructor(private readonly clienteService: ClienteService) {}

    @Roles(Role.ADMIN_CLIENTE, Role.READ_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async findAll() {
        return await this.clienteService.findAll();
    }

    @Roles(Role.ADMIN_CLIENTE, Role.READ_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':clienteId')
    async findOne(@Param('clienteId') clienteId: string) {
        return await this.clienteService.findOne(clienteId);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.WRITE_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async create(@Body() clienteDto: ClienteDto) {
        const cliente: ClienteEntity = plainToInstance(ClienteEntity, clienteDto);
        return await this.clienteService.create(cliente);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.WRITE_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':clienteId')
    async update(@Param('clienteId') clienteId: string, @Body() clienteDto: ClienteDto) {
    const cliente: ClienteEntity = plainToInstance(ClienteEntity, clienteDto);
        return await this.clienteService.update(clienteId, cliente);
    }       

    @Roles(Role.ADMIN_CLIENTE, Role.DELETE_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':clienteId')
    @HttpCode(204)
    async delete(@Param('clienteId') clienteId: string) {
        return await this.clienteService.delete(clienteId);
    }
}
