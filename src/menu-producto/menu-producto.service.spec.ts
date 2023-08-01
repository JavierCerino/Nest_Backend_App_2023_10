/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { MenuEntity } from '../menu/menu.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MenuProductoService } from './menu-producto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('MenuProductoService', () => {
  let service: MenuProductoService;
  let menuRepository: Repository<MenuEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let menu: MenuEntity;
  let productosList : ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MenuProductoService],
    }).compile();

    service = module.get<MenuProductoService>(MenuProductoService);
    menuRepository = module.get<Repository<MenuEntity>>(getRepositoryToken(MenuEntity));
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    menuRepository.clear();

    productosList = [];
    for(let i = 0; i < 5; i++){
        const producto: ProductoEntity = await productoRepository.save({
          nombre: faker.commerce.product(), 
          tipoProducto: faker.commerce.productMaterial(),
          precio: parseFloat(faker.commerce.price()),
          image: faker.image.imageUrl()
        })
        productosList.push(producto);
    }

    menu = await menuRepository.save({
      nombre: faker.company.name(),
      productos: productosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductoMenu should add an producto to a menu', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.product(), 
      tipoProducto: faker.commerce.productMaterial(),
      precio: parseFloat(faker.commerce.price()),
      image: faker.image.imageUrl()
    });

    const newMenu: MenuEntity = await menuRepository.save({
      nombre: faker.company.name()
    })

    const result: MenuEntity = await service.addProductoMenu(newMenu.id, newProducto.id);
    
    expect(result.productos.length).toBe(1);
    expect(result.productos[0]).not.toBeNull();
    expect(result.productos[0].nombre).toBe(newProducto.nombre)
    expect(result.productos[0].tipoProducto).toBe(newProducto.tipoProducto)
    expect(result.productos[0].precio).toBe(newProducto.precio)
    expect(result.productos[0].image).toBe(newProducto.image)
  });

  it('addProductoMenu should thrown exception for an invalid producto', async () => {
    const newMenu: MenuEntity = await menuRepository.save({
      nombre: faker.company.name()
    })

    await expect(() => service.addProductoMenu(newMenu.id, "0")).rejects.toHaveProperty("message", "Producto no encontrado");
  });

  it('addProductoMenu should throw an exception for an invalid menu', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.product(), 
      tipoProducto: faker.commerce.productMaterial(),
      precio: parseFloat(faker.commerce.price()),
      image: faker.image.imageUrl()
    });

    await expect(() => service.addProductoMenu("0", newProducto.id)).rejects.toHaveProperty("message", "Menu no encontrado");
  });

  it('findProductoByMenuIdProductoId should return producto by menu', async () => {
    const producto: ProductoEntity = productosList[0];
    const storedProducto: ProductoEntity = await service.findProductoByMenuIdProductoId(menu.id, producto.id)
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toBe(producto.nombre);
    expect(storedProducto.tipoProducto).toBe(producto.tipoProducto);
    expect(storedProducto.precio).toBe(producto.precio);
    expect(storedProducto.image).toBe(producto.image);
  });

  it('findProductoByMenuIdProductoId should throw an exception for an invalid producto', async () => {
    await expect(()=> service.findProductoByMenuIdProductoId(menu.id, "0")).rejects.toHaveProperty("message", "Producto no encontrado"); 
  });

  it('findProductoByMenuIdProductoId should throw an exception for an invalid menu', async () => {
    const producto: ProductoEntity = productosList[0]; 
    await expect(()=> service.findProductoByMenuIdProductoId("0", producto.id)).rejects.toHaveProperty("message", "Menu no encontrado"); 
  });

  it('findProductoByMenuIdProductoId should throw an exception for an producto not associated to the menu', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.product(), 
      tipoProducto: faker.commerce.productMaterial(),
      precio: parseFloat(faker.commerce.price()),
      image: faker.image.imageUrl()

    });

    await expect(()=> service.findProductoByMenuIdProductoId(menu.id, newProducto.id)).rejects.toHaveProperty("message", "El producto no esta asociado al menu"); 
  });

  it('findProductosByMenuId should return productos by menu', async ()=>{
    const productos: ProductoEntity[] = await service.findProductosByMenuId(menu.id);
    expect(productos.length).toBe(5)
  });

  it('findProductosByMenuId should throw an exception for an invalid menu', async () => {
    await expect(()=> service.findProductosByMenuId("0")).rejects.toHaveProperty("message", "Menu no encontrado"); 
  });

  it('associateProductosMenu should update productos list for a menu', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.product(), 
      tipoProducto: faker.commerce.productMaterial(),
      precio: parseFloat(faker.commerce.price()),
      image: faker.image.imageUrl()
    });

    const updatedMenu: MenuEntity = await service.associateProductosMenu(menu.id, [newProducto]);
    expect(updatedMenu.productos.length).toBe(1);

    expect(updatedMenu.productos[0].nombre).toBe(newProducto.nombre);
    expect(updatedMenu.productos[0].tipoProducto).toBe(newProducto.tipoProducto);
    expect(updatedMenu.productos[0].precio).toBe(newProducto.precio);
    expect(updatedMenu.productos[0].image).toBe(newProducto.image);

  });

  it('associateProductosMenu should throw an exception for an invalid menu', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.product(), 
      tipoProducto: faker.commerce.productMaterial(),
      precio: parseFloat(faker.commerce.price()),
      image: faker.image.imageUrl()
    });

    await expect(()=> service.associateProductosMenu("0", [newProducto])).rejects.toHaveProperty("message", "Menu no encontrado"); 
  });

  it('associateProductosMenu should throw an exception for an invalid producto', async () => {
    const newProducto: ProductoEntity = productosList[0];
    newProducto.id = "0";

    await expect(()=> service.associateProductosMenu(menu.id, [newProducto])).rejects.toHaveProperty("message", "Producto no encontrado"); 
  });

  it('deleteProductoToMenu should remove an producto from a menu', async () => {
    const producto: ProductoEntity = productosList[0];
    
    await service.deleteProductoMenu(menu.id, producto.id);

    const storedMenu: MenuEntity = await menuRepository.findOne({where: {id: menu.id}, relations: ["productos"]});
    const deletedProducto: ProductoEntity = storedMenu.productos.find(a => a.id === producto.id);

    expect(deletedProducto).toBeUndefined();

  });

  it('deleteProductoToMenu should thrown an exception for an invalid producto', async () => {
    await expect(()=> service.deleteProductoMenu(menu.id, "0")).rejects.toHaveProperty("message", "Producto no encontrado"); 
  });

  it('deleteProductoToMenu should thrown an exception for an invalid menu', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(()=> service.deleteProductoMenu("0", producto.id)).rejects.toHaveProperty("message", "Menu no encontrado"); 
  });

  it('deleteProductoToMenu should thrown an exception for an non asocciated producto', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(), 
      tipoProducto: faker.commerce.productMaterial(),
      precio: parseFloat(faker.commerce.price()),
      image: faker.image.imageUrl()
    });

    await expect(()=> service.deleteProductoMenu(menu.id, newProducto.id)).rejects.toHaveProperty("message", "El producto no esta asociado al menu"); 
  }); 

});