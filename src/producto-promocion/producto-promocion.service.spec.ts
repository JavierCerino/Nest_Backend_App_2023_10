import { Test, TestingModule } from '@nestjs/testing';
import { PromocionEntity } from '../promocion/promocion.entity';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductoPromocionService } from './producto-promocion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ProductoPromocionService', () => {
  let service: ProductoPromocionService;
  let productoRepository: Repository<ProductoEntity>;
  let promocionRepository: Repository<PromocionEntity>;
  let producto: ProductoEntity;
  let promocionesList : PromocionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoPromocionService],
    }).compile();

    service = module.get<ProductoPromocionService>(ProductoPromocionService);
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    promocionRepository = module.get<Repository<PromocionEntity>>(getRepositoryToken(PromocionEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    promocionRepository.clear();
    productoRepository.clear();

    promocionesList = [];
    for(let i = 0; i < 5; i++){
        const promocion: PromocionEntity = await promocionRepository.save({
          tipo: faker.word.adjective(),
          descripcion: faker.lorem.sentence()
        })
        promocionesList.push(promocion);
    }

    producto = await productoRepository.save({
      nombre: faker.commerce.product(), 
      tipoProducto: faker.word.adjective(), 
      precio: parseFloat(faker.commerce.price()), 
      image: faker.image.imageUrl(),
      promociones: promocionesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPromocionProducto should add an promocion to a producto', async () => {
    const newPromocion: PromocionEntity = await promocionRepository.save({
      tipo: faker.word.adjective(),
      descripcion: faker.lorem.sentence()
    });

    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.product(), 
      tipoProducto: faker.word.adjective(), 
      precio: parseFloat(faker.commerce.price()),
      image: faker.image.imageUrl()
    })

    const result: ProductoEntity = await service.addPromocionProducto(newProducto.id, newPromocion.id);
    
    expect(result.promociones.length).toBe(1);
    expect(result.promociones[0]).not.toBeNull();
    expect(result.promociones[0].tipo).toBe(newPromocion.tipo)
    expect(result.promociones[0].descripcion).toBe(newPromocion.descripcion)
  });

  it('addPromocionProducto should thrown exception for an invalid promocion', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.product(), 
      tipoProducto: faker.word.adjective(), 
      precio: parseFloat(faker.commerce.price()),
      image: faker.image.imageUrl()
    })

    await expect(() => service.addPromocionProducto(newProducto.id, "0")).rejects.toHaveProperty("message", "Promocion no encontrada");
  });

  it('addPromocionProducto should throw an exception for an invalid producto', async () => {
    const newPromocion: PromocionEntity = await promocionRepository.save({
      tipo: faker.word.adjective(),
      descripcion: faker.lorem.sentence()
    });

    await expect(() => service.addPromocionProducto("0", newPromocion.id)).rejects.toHaveProperty("message", "Producto no encontrado");
  });

  it('findPromocionByProductoIdPromocionId should return promocion by producto', async () => {
    const promocion: PromocionEntity = promocionesList[0];
    const storedPromocion: PromocionEntity = await service.findPromocionByProductoIdPromocionId(producto.id, promocion.id, )
    expect(storedPromocion).not.toBeNull();
    expect(storedPromocion.tipo).toBe(promocion.tipo);
    expect(storedPromocion.descripcion).toBe(promocion.descripcion);
  });

  it('findPromocionByProductoIdPromocionId should throw an exception for an invalid promocion', async () => {
    await expect(()=> service.findPromocionByProductoIdPromocionId(producto.id, "0")).rejects.toHaveProperty("message", "Promocion no encontrada"); 
  });

  it('findPromocionByProductoIdPromocionId should throw an exception for an invalid producto', async () => {
    const promocion: PromocionEntity = promocionesList[0]; 
    await expect(()=> service.findPromocionByProductoIdPromocionId("0", promocion.id)).rejects.toHaveProperty("message", "Producto no encontrado"); 
  });

  it('findPromocionByProductoIdPromocionId should throw an exception for an promocion not associated to the producto', async () => {
    const newPromocion: PromocionEntity = await promocionRepository.save({
      tipo: faker.word.adjective(),
      descripcion: faker.lorem.sentence()
    });

    await expect(()=> service.findPromocionByProductoIdPromocionId(producto.id, newPromocion.id)).rejects.toHaveProperty("message", "La promocion con el id dado no está asociado al producto"); 
  });

  it('findPromocionsByProductoId should return promociones by producto', async ()=>{
    const promociones: PromocionEntity[] = await service.findPromocionsByProductoId(producto.id);
    expect(promociones.length).toBe(5)
  });

  it('findPromocionsByProductoId should throw an exception for an invalid producto', async () => {
    await expect(()=> service.findPromocionsByProductoId("0")).rejects.toHaveProperty("message", "Producto no encontrado"); 
  });

  it('associatePromocionsProducto should update promociones list for a producto', async () => {
    const newPromocion: PromocionEntity = await promocionRepository.save({
      tipo: faker.word.adjective(),
      descripcion: faker.lorem.sentence()
    });

    const updatedProducto: ProductoEntity = await service.associatePromocionsProducto(producto.id, [newPromocion]);
    expect(updatedProducto.promociones.length).toBe(1);

    expect(updatedProducto.promociones[0].tipo).toBe(newPromocion.tipo);
    expect(updatedProducto.promociones[0].descripcion).toBe(newPromocion.descripcion);
  });

  it('associatePromocionsProducto should throw an exception for an invalid producto', async () => {
    const newPromocion: PromocionEntity = await promocionRepository.save({
      tipo: faker.word.adjective(),
      descripcion: faker.lorem.sentence()
    });

    await expect(()=> service.associatePromocionsProducto("0", [newPromocion])).rejects.toHaveProperty("message", "Producto no encontrado"); 
  });

  it('associatePromocionsProducto should throw an exception for an invalid promocion', async () => {
    const newPromocion: PromocionEntity = promocionesList[0];
    newPromocion.id = "0";

    await expect(()=> service.associatePromocionsProducto(producto.id, [newPromocion])).rejects.toHaveProperty("message", "Promocion no encontrada"); 
  });

  it('deletePromocionToProducto should remove an promocion from a producto', async () => {
    const promocion: PromocionEntity = promocionesList[0];
    
    await service.deletePromocionProducto(producto.id, promocion.id);

    const storedProducto: ProductoEntity = await productoRepository.findOne({where: {id: producto.id}, relations: ["promociones"]});
    const deletedPromocion: PromocionEntity = storedProducto.promociones.find(a => a.id === promocion.id);

    expect(deletedPromocion).toBeUndefined();

  });

  it('deletePromocionToProducto should thrown an exception for an invalid promocion', async () => {
    await expect(()=> service.deletePromocionProducto(producto.id, "0")).rejects.toHaveProperty("message", "Promocion no encontrada"); 
  });

  it('deletePromocionToProducto should thrown an exception for an invalid producto', async () => {
    const promocion: PromocionEntity = promocionesList[0];
    await expect(()=> service.deletePromocionProducto("0", promocion.id)).rejects.toHaveProperty("message", "Producto no encontrado"); 
  });

  it('deletePromocionToProducto should thrown an exception for an non asocciated promocion', async () => {
    const newPromocion: PromocionEntity = await promocionRepository.save({
      tipo: faker.word.adjective(),
      descripcion: faker.lorem.sentence()
    });

    await expect(()=> service.deletePromocionProducto(producto.id, newPromocion.id)).rejects.toHaveProperty("message", "La promocion con el id dado no está asociado al producto"); 
  }); 

});