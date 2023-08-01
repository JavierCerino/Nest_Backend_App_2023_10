import { Test, TestingModule } from '@nestjs/testing';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { PromocionEntity } from '../promocion/promocion.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PromocionProductoService } from './promocion-producto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('PromocionProductoService', () => {
  let service: PromocionProductoService;
  let promocionRepository: Repository<PromocionEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let promocion: PromocionEntity;
  let productosList : ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PromocionProductoService],
    }).compile();

    service = module.get<PromocionProductoService>(PromocionProductoService);
    promocionRepository = module.get<Repository<PromocionEntity>>(getRepositoryToken(PromocionEntity));
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    promocionRepository.clear();

    productosList = [];
    for(let i = 0; i < 5; i++){
        const producto: ProductoEntity = await productoRepository.save({
          nombre: faker.commerce.product(), 
          tipoProducto: faker.word.adjective(), 
          precio: parseFloat(faker.commerce.price()),
          image: faker.image.imageUrl()
        })
        productosList.push(producto);
    }

    promocion = await promocionRepository.save({
      tipo: faker.word.adjective(),
      descripcion: faker.lorem.sentence(),
      productos: productosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductoPromocion should add an producto to a promocion', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.product(), 
      tipoProducto: faker.word.adjective(), 
      precio: parseFloat(faker.commerce.price()),
      image: faker.image.imageUrl()
    });

    const newPromocion: PromocionEntity = await promocionRepository.save({
      tipo: faker.word.adjective(),
      descripcion: faker.lorem.sentence()
    })

    const result: PromocionEntity = await service.addProductoPromocion(newPromocion.id, newProducto.id);
    
    expect(result.productos.length).toBe(1);
    expect(result.productos[0]).not.toBeNull();
    expect(result.productos[0].nombre).toBe(newProducto.nombre)
    expect(result.productos[0].tipoProducto).toBe(newProducto.tipoProducto)
    expect(result.productos[0].precio).toBe(newProducto.precio)
    expect(result.productos[0].image).toBe(newProducto.image)
  });

  it('addProductoPromocion should thrown exception for an invalid producto', async () => {
    const newPromocion: PromocionEntity = await promocionRepository.save({
      tipo: faker.word.adjective(),
      descripcion: faker.lorem.sentence()
    })

    await expect(() => service.addProductoPromocion(newPromocion.id, "0")).rejects.toHaveProperty("message", "Producto no encontrado");
  });

  it('addProductoPromocion should throw an exception for an invalid promocion', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.product(), 
      tipoProducto: faker.word.adjective(), 
      precio: parseFloat(faker.commerce.price()),
      image: faker.image.imageUrl()
    });

    await expect(() => service.addProductoPromocion("0", newProducto.id)).rejects.toHaveProperty("message", "Promocion no encontrada");
  });

  it('findProductoByPromocionIdProductoId should return producto by promocion', async () => {
    const producto: ProductoEntity = productosList[0];
    const storedProducto: ProductoEntity = await service.findProductoByPromocionIdProductoId(promocion.id, producto.id, )
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toBe(producto.nombre);
    expect(storedProducto.tipoProducto).toBe(producto.tipoProducto);
    expect(storedProducto.precio).toBe(producto.precio);
    expect(storedProducto.image).toBe(producto.image);
  });

  it('findProductoByPromocionIdProductoId should throw an exception for an invalid producto', async () => {
    await expect(()=> service.findProductoByPromocionIdProductoId(promocion.id, "0")).rejects.toHaveProperty("message", "Producto no encontrado"); 
  });

  it('findProductoByPromocionIdProductoId should throw an exception for an invalid promocion', async () => {
    const producto: ProductoEntity = productosList[0]; 
    await expect(()=> service.findProductoByPromocionIdProductoId("0", producto.id)).rejects.toHaveProperty("message", "Promocion no encontrada"); 
  });

  it('findProductoByPromocionIdProductoId should throw an exception for an producto not associated to the promocion', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.product(), 
      tipoProducto: faker.word.adjective(), 
      precio: parseFloat(faker.commerce.price()),
      image: faker.image.imageUrl()
    });

    await expect(()=> service.findProductoByPromocionIdProductoId(promocion.id, newProducto.id)).rejects.toHaveProperty("message", "El producto con el id dado no está asociado a la promocion"); 
  });

  it('findProductosByPromocionId should return productos by promocion', async ()=>{
    const productos: ProductoEntity[] = await service.findProductosByPromocionId(promocion.id);
    expect(productos.length).toBe(5)
  });

  it('findProductosByPromocionId should throw an exception for an invalid promocion', async () => {
    await expect(()=> service.findProductosByPromocionId("0")).rejects.toHaveProperty("message", "Promocion no encontrada"); 
  });

  it('associateProductosPromocion should update productos list for a promocion', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.product(), 
      tipoProducto: faker.word.adjective(), 
      precio: parseFloat(faker.commerce.price()),
      image: faker.image.imageUrl()
    });

    const updatedPromocion: PromocionEntity = await service.associateProductosPromocion(promocion.id, [newProducto]);
    expect(updatedPromocion.productos.length).toBe(1);

    expect(updatedPromocion.productos[0].nombre).toBe(newProducto.nombre);
    expect(updatedPromocion.productos[0].tipoProducto).toBe(newProducto.tipoProducto);
    expect(updatedPromocion.productos[0].precio).toBe(newProducto.precio);
    expect(updatedPromocion.productos[0].image).toBe(newProducto.image);
  });

  it('associateProductosPromocion should throw an exception for an invalid promocion', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.product(), 
      tipoProducto: faker.word.adjective(), 
      precio: parseFloat(faker.commerce.price()),
      image: faker.image.imageUrl()
    });

    await expect(()=> service.associateProductosPromocion("0", [newProducto])).rejects.toHaveProperty("message", "Promocion no encontrada"); 
  });

  it('associateProductosPromocion should throw an exception for an invalid producto', async () => {
    const newProducto: ProductoEntity = productosList[0];
    newProducto.id = "0";

    await expect(()=> service.associateProductosPromocion(promocion.id, [newProducto])).rejects.toHaveProperty("message", "Producto no encontrado"); 
  });

  it('deleteProductoToPromocion should remove an producto from a promocion', async () => {
    const producto: ProductoEntity = productosList[0];
    
    await service.deleteProductoPromocion(promocion.id, producto.id);

    const storedPromocion: PromocionEntity = await promocionRepository.findOne({where: {id: promocion.id}, relations: ["productos"]});
    const deletedProducto: ProductoEntity = storedPromocion.productos.find(a => a.id === producto.id);

    expect(deletedProducto).toBeUndefined();

  });

  it('deleteProductoToPromocion should thrown an exception for an invalid producto', async () => {
    await expect(()=> service.deleteProductoPromocion(promocion.id, "0")).rejects.toHaveProperty("message", "Producto no encontrado"); 
  });

  it('deleteProductoToPromocion should thrown an exception for an invalid promocion', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(()=> service.deleteProductoPromocion("0", producto.id)).rejects.toHaveProperty("message", "Promocion no encontrada"); 
  });

  it('deleteProductoToPromocion should thrown an exception for an non asocciated producto', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.product(), 
      tipoProducto: faker.word.adjective(), 
      precio: parseFloat(faker.commerce.price()),
      image: faker.image.imageUrl()
    });

    await expect(()=> service.deleteProductoPromocion(promocion.id, newProducto.id)).rejects.toHaveProperty("message", "El producto con el id dado no está asociado a la promocion"); 
  }); 

});