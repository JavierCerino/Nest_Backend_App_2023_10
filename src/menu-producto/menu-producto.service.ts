import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { MenuEntity } from '../menu/menu.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class MenuProductoService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,

    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async addProductoMenu(menuId: string, productoId: string): Promise<MenuEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException('Producto no encontrado',BusinessError.NOT_FOUND);

    const menu: MenuEntity = await this.menuRepository.findOne({where: { id: menuId }, relations: ['productos'], });
    if (!menu)
      throw new BusinessLogicException('Menu no encontrado', BusinessError.NOT_FOUND);

    menu.productos = [...menu.productos, producto];
    return await this.menuRepository.save(menu);
  }

  async findProductoByMenuIdProductoId(menuId: string, productoId: string, ): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({ where: { id: productoId }, });
    if (!producto)
      throw new BusinessLogicException('Producto no encontrado', BusinessError.NOT_FOUND);

    const menu: MenuEntity = await this.menuRepository.findOne({ where: { id: menuId }, relations: ['productos'],});
    if (!menu)
      throw new BusinessLogicException('Menu no encontrado', BusinessError.NOT_FOUND);

    const menuProducto: ProductoEntity = menu.productos.find( (e) => e.id === producto.id,  );

    if (!menuProducto)
      throw new BusinessLogicException('El producto no esta asociado al menu', BusinessError.PRECONDITION_FAILED, );
    return menuProducto;
  }

  async findProductosByMenuId(menuId: string): Promise<ProductoEntity[]> {const menu: MenuEntity = await this.menuRepository.findOne({where: { id: menuId },relations: ['productos'], });
    if (!menu)
      throw new BusinessLogicException('Menu no encontrado',BusinessError.NOT_FOUND);
    return menu.productos;
  }

  async associateProductosMenu(menuId: string, productos: ProductoEntity[]): Promise<MenuEntity> {
    const menu: MenuEntity = await this.menuRepository.findOne({where: {id: menuId}, relations: ["productos"]});

    if (!menu)
      throw new BusinessLogicException("Menu no encontrado", BusinessError.NOT_FOUND)

    for (let i = 0; i < productos.length; i++) {
      const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productos[i].id}});
      if (!producto)
        throw new BusinessLogicException("Producto no encontrado", BusinessError.NOT_FOUND)
    }

    menu.productos = productos;
    return await this.menuRepository.save(menu);
  }

async deleteProductoMenu(menuId: string, productoId: string){
    const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}});
    if (!producto)
      throw new BusinessLogicException("Producto no encontrado", BusinessError.NOT_FOUND)

    const menu: MenuEntity = await this.menuRepository.findOne({where: {id: menuId}, relations: ["productos"]});
    if (!menu)
      throw new BusinessLogicException("Menu no encontrado", BusinessError.NOT_FOUND)

    const menuProducto: ProductoEntity = menu.productos.find(e => e.id === producto.id);

    if (!menuProducto)
        throw new BusinessLogicException("El producto no esta asociado al menu", BusinessError.PRECONDITION_FAILED)

    menu.productos = menu.productos.filter(e => e.id !== productoId);
    await this.menuRepository.save(menu);
    }  
}
