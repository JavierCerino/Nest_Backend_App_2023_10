/* eslint-disable prettier/prettier */
import { Controller, UseGuards, UseInterceptors, Post, Get, Put, Delete, HttpCode, Param, Body } from '@nestjs/common';
import { ReseniaDto } from '../resenia/resenia.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { ClienteReseniaService } from './cliente-resenia.service';
import { ReseniaEntity } from 'src/resenia/resenia.entity';
import { Role } from '../shared/security/utils/role.enum';
import { Roles } from '../shared/security/utils/roles.decorator';
import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('clientes')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClienteReseniaController {
    constructor(private readonly clienteReseniaService: ClienteReseniaService){}

    @Roles(Role.ADMIN_CLIENTE, Role.WRITE_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':clienteId/resenias/:reseniaId')
    async addReseniaCliente(@Param('clienteId') clienteId: string, @Param('reseniaId') reseniaId: string){
        return await this.clienteReseniaService.addReseniaCliente(clienteId, reseniaId);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.READ_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':clienteId/resenias/:reseniaId')
    async findReseniaByClienteIdReseniaId(@Param('clienteId') clienteId: string, @Param('reseniaId') reseniaId: string){
        return await this.clienteReseniaService.findReseniaByClienteIdReseniaId(clienteId, reseniaId);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.READ_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':clienteId/resenias')
    async findReseniasByClienteId(@Param('clienteId') clienteId: string){
        return await this.clienteReseniaService.findReseniasByClienteId(clienteId);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.WRITE_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':clienteId/resenias')
    async associateReseniasCliente(@Body() reseniasDto: ReseniaDto[], @Param('clienteId') clienteId: string){
        const resenias = plainToInstance(ReseniaEntity, reseniasDto)
        return await this.clienteReseniaService.associateReseniasCliente(clienteId, resenias);
    }

    @Roles(Role.ADMIN_CLIENTE, Role.DELETE_CLIENTE)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':clienteId/resenias/:reseniaId')
    @HttpCode(204)
    async deleteReseniaCliente(@Param('clienteId') clienteId: string, @Param('reseniaId') reseniaId: string){
        return await this.clienteReseniaService.deleteReseniaCliente(clienteId, reseniaId);
    }
}
