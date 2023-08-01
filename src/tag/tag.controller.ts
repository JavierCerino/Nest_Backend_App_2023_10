/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { TagDto } from './tag.dto';
import { TagEntity } from './tag.entity';
import { TagService } from './tag.service';
import { Roles } from '../shared/security/utils/roles.decorator';
import { Role } from '../shared/security/utils/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles-auth.guard';

@Controller('tags')
@UseInterceptors(BusinessErrorsInterceptor)
export class TagController {
    
    constructor(private readonly tagService: TagService) {}

    @Roles(Role.ADMIN_TAG, Role.READ_TAG)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async findAll() {
        return await this.tagService.findAll();
    }

    @Roles(Role.ADMIN_TAG, Role.READ_TAG)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':tagId')
    async findOne(@Param('tagId') tagId: string) {
        return await this.tagService.findOne(tagId);
    }

    @Roles(Role.ADMIN_TAG, Role.WRITE_TAG)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async create(@Body() tagDto: TagDto) {
        const tag: TagEntity = plainToInstance(TagEntity, tagDto);
        return await this.tagService.create(tag);
    }

    @Roles(Role.ADMIN_TAG, Role.WRITE_TAG)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':tagId')
    async update(@Param('tagId') tagId: string, @Body() tagDto: TagDto) {
        const tag: TagEntity = plainToInstance(TagEntity, tagDto);
        return await this.tagService.update(tagId, tag);
    }

    @Roles(Role.ADMIN_TAG, Role.DELETE_TAG)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':tagId')
    @HttpCode(204)
    async delete(@Param('tagId') tagId: string) {
        return await this.tagService.delete(tagId);
    }
}
