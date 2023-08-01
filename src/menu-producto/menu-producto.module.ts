import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuEntity } from 'src/menu/menu.entity';
import { MenuService } from 'src/menu/menu.service';
import { ProductoEntity } from 'src/producto/producto.entity';
import { MenuProductoService } from './menu-producto.service';
import { MenuProductoController } from './menu-producto.controller';

@Module({
    imports: [TypeOrmModule.forFeature([MenuEntity, ProductoEntity])],
    controllers: [MenuProductoController],
    providers: [MenuProductoService],
})
export class MenuProductoModule { }
