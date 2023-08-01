import { Test, TestingModule } from '@nestjs/testing';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { ReservaEntity } from '../reserva/reserva.entity';
import { ReservaProductoService } from './reserva-producto.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ReservaProductoService', () => {
  let service: ReservaProductoService;
  let reservaRepository: Repository<ReservaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let reserva: ReservaEntity;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ReservaProductoService],
    }).compile();

    service = module.get<ReservaProductoService>(ReservaProductoService);
    reservaRepository = module.get<Repository<ReservaEntity>>(getRepositoryToken(ReservaEntity));
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    reservaRepository.clear();

    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await productoRepository.save({
        nombre : faker.company.name(),
        tipoProducto : faker.commerce.productName(),
        precio : parseInt(faker.random.numeric()),
        image : faker.image.imageUrl()
      })
      productosList.push(producto);
    }

    reserva = await reservaRepository.save({
      fecha: faker.date.future(),
      mesaAsignada: parseInt(faker.random.numeric()),
      numPersonas: parseInt(faker.random.numeric()),
      tipo: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      productos: productosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductoReserva should add an producto to a reserva', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre : faker.company.name(),
      tipoProducto : faker.commerce.productName(),
      precio : parseInt(faker.random.numeric()),
      image : faker.image.imageUrl()
    });

    const newReserva: ReservaEntity = await reservaRepository.save({
      fecha: faker.date.future(),
      mesaAsignada: parseInt(faker.random.numeric()),
      numPersonas: parseInt(faker.random.numeric()),
      tipo: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      productos: []
    })

    const result: ReservaEntity = await service.addProductoReserva(newReserva.id, newProducto.id);

    expect(result.productos.length).toBe(1);
    expect(result.productos[0]).not.toBeNull();
    expect(result.productos[0].nombre).toBe(newProducto.nombre)
    expect(result.productos[0].tipoProducto).toBe(newProducto.tipoProducto)
    expect(result.productos[0].precio).toBe(newProducto.precio),
    expect(result.productos[0].image).toBe(newProducto.image)
  });

  it('addProductoReserva should thrown exception for an invalid producto', async () => {
    const newReserva: ReservaEntity = await reservaRepository.save({
      fecha: faker.date.future(),
      mesaAsignada: parseInt(faker.random.numeric()),
      numPersonas: parseInt(faker.random.numeric()),
      tipo: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      productos: productosList
    })

    await expect(() => service.addProductoReserva(newReserva.id, "0")).rejects.toHaveProperty("message", "The producto with the given id was not found");
  });

  it('addProductoReserva should throw an exception for an invalid reserva', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre : faker.company.name(),
      tipoProducto : faker.commerce.productName(),
      precio : parseInt(faker.random.numeric()),
      image : faker.image.imageUrl()
    });

    await expect(() => service.addProductoReserva("0", newProducto.id)).rejects.toHaveProperty("message", "The reserva with the given id was not found");
  });

  it('findProductoByReservaIdProductoId should return producto by reserva', async () => {
    const producto: ProductoEntity = productosList[0];
    const storedProducto: ProductoEntity = await service.findProductoByReservaIdProductoId(reserva.id, producto.id,)
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toBe(producto.nombre);
    expect(storedProducto.tipoProducto).toBe(producto.tipoProducto);
    expect(storedProducto.precio).toBe(producto.precio);
    expect(storedProducto.image).toBe(producto.image);
  });

  it('findProductoByReservaIdProductoId should throw an exception for an invalid producto', async () => {
    await expect(() => service.findProductoByReservaIdProductoId(reserva.id, "0")).rejects.toHaveProperty("message", "The producto with the given id was not found");
  });

  it('findProductoByReservaIdProductoId should throw an exception for an invalid reserva', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(() => service.findProductoByReservaIdProductoId("0", producto.id)).rejects.toHaveProperty("message", "The reserva with the given id was not found");
  });

  it('findProductoByReservaIdProductoId should throw an exception for an producto not associated to the reserva', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre : faker.company.name(),
      tipoProducto : faker.commerce.productName(),
      precio : parseInt(faker.random.numeric()),
      image : faker.image.imageUrl()
    });

    await expect(() => service.findProductoByReservaIdProductoId(reserva.id, newProducto.id)).rejects.toHaveProperty("message", "The producto with the given id is not associated to the reserva");
  });

  it('findProductosByReservaId should return productos by reserva', async () => {
    const productos: ProductoEntity[] = await service.findProductosByReservaId(reserva.id);
    expect(productos.length).toBe(5)
  });

  it('findProductosByReservaId should throw an exception for an invalid reserva', async () => {
    await expect(() => service.findProductosByReservaId("0")).rejects.toHaveProperty("message", "The reserva with the given id was not found");
  });

  it('associateProductosReserva should update productos list for a reserva', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre : faker.company.name(),
      tipoProducto : faker.commerce.productName(),
      precio : parseInt(faker.random.numeric()),
      image : faker.image.imageUrl()
    });

    const updatedReserva: ReservaEntity = await service.associateProductosReserva(reserva.id, [newProducto]);
    expect(updatedReserva.productos.length).toBe(1);

    expect(updatedReserva.productos[0].nombre).toBe(newProducto.nombre);
    expect(updatedReserva.productos[0].tipoProducto).toBe(newProducto.tipoProducto);
    expect(updatedReserva.productos[0].precio).toBe(newProducto.precio);
  });

  it('associateProductosReserva should throw an exception for an invalid reserva', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre : faker.company.name(),
      tipoProducto : faker.commerce.productName(),
      precio : parseInt(faker.random.numeric()),
      image : faker.image.imageUrl()
    });

    await expect(() => service.associateProductosReserva("0", [newProducto])).rejects.toHaveProperty("message", "The reserva with the given id was not found");
  });

  it('associateProductosReserva should throw an exception for an invalid producto', async () => {
    const newProducto: ProductoEntity = productosList[0];
    newProducto.id = "0";

    await expect(() => service.associateProductosReserva(reserva.id, [newProducto])).rejects.toHaveProperty("message", "The producto with the given id was not found");
  });

  it('deleteProductoToReserva should remove an producto from a reserva', async () => {
    const producto: ProductoEntity = productosList[0];

    await service.deleteProductoReserva(reserva.id, producto.id);

    const storedReserva: ReservaEntity = await reservaRepository.findOne({ where: { id: reserva.id }, relations: ["productos"] });
    const deletedProducto: ProductoEntity = storedReserva.productos.find(a => a.id === producto.id);

    expect(deletedProducto).toBeUndefined();

  });

  it('deleteProductoToReserva should thrown an exception for an invalid producto', async () => {
    await expect(() => service.deleteProductoReserva(reserva.id, "0")).rejects.toHaveProperty("message", "The producto with the given id was not found");
  });

  it('deleteProductoToReserva should thrown an exception for an invalid reserva', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(() => service.deleteProductoReserva("0", producto.id)).rejects.toHaveProperty("message", "The reserva with the given id was not found");
  });

  it('deleteProductoToReserva should thrown an exception for an non asocciated producto', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre : faker.company.name(),
      tipoProducto : faker.commerce.productName(),
      precio : parseInt(faker.random.numeric()),
      image : faker.image.imageUrl()
    });

    await expect(() => service.deleteProductoReserva(reserva.id, newProducto.id)).rejects.toHaveProperty("message", "The producto with the given id is not associated to the reserva");
  });

});
