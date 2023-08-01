import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PromocionEntity } from './promocion.entity';
import { PromocionModule } from './promocion.module';
import { PromocionService } from './promocion.service';

import { faker } from '@faker-js/faker';
import { dematerialize } from 'rxjs';

describe('PromocionService', () => {
  let service: PromocionService;
  let repository: Repository<PromocionEntity>;
  let promocionesList: PromocionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PromocionService],
    }).compile();

    service = module.get<PromocionService>(PromocionService);
    repository = module.get<Repository<PromocionEntity>>(getRepositoryToken(PromocionEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    promocionesList = [];
    for(let i = 0; i < 5; i++){
        const promocion: PromocionEntity = await repository.save({
        tipo: faker.lorem.sentence(),
        descripcion: faker.lorem.sentences()})
        promocionesList.push(promocion);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne should return a promocion by id', async () => {
    const storedPromocion: PromocionEntity = promocionesList[0];
    const promocion: PromocionEntity = await service.findOne(storedPromocion.id);
    expect(promocion).not.toBeNull();
    expect(promocion.tipo).toEqual(storedPromocion.tipo)
    expect(promocion.descripcion).toEqual(storedPromocion.descripcion)
  });

  it('findAll should return all promociones', async () => {
    const promociones: PromocionEntity[] = await service.findAll();
    expect(promociones).not.toBeNull();
    expect(promociones).toHaveLength(promocionesList.length);
  });

  it('findOne should throw an exception for an invalid promocion', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "Promocion no encontrada")
  });

  it('create should return a new promocion', async () => {
    const promocion: PromocionEntity = {
      id: "",
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentences(),
      productos:[],
      establecimiento: null
    }

    const newPromocion: PromocionEntity = await service.create(promocion);
    expect(newPromocion).not.toBeNull();

    const storedPromocion: PromocionEntity = await repository.findOne({where: {id: newPromocion.id}})
    expect(storedPromocion).not.toBeNull();
    expect(storedPromocion.tipo).toEqual(promocion.tipo)
    expect(storedPromocion.descripcion).toEqual(promocion.descripcion)
  });

  it('update should modify a promocion', async () => {
    const promocion: PromocionEntity = promocionesList[0];
    promocion.descripcion = faker.lorem.sentences();
    const updatedPromocion: PromocionEntity = await service.update(promocion.id, promocion);
    expect(updatedPromocion).not.toBeNull();
    const storedPromocion: PromocionEntity = await repository.findOne({where: {id: updatedPromocion.id}})
    expect(storedPromocion).not.toBeNull();
    expect(storedPromocion.tipo).toEqual(promocion.tipo)
    expect(storedPromocion.descripcion).toEqual(promocion.descripcion)
  });
  it('update should throw an exception for an invalid promocion', async () => {
    let promocion: PromocionEntity = promocionesList[0];
    promocion = {
      ...promocion, tipo: "New name", descripcion: "New address"
    }
    await expect(() => service.update("0", promocion)).rejects.toHaveProperty("message", "Promocion no encontrada")
  });
  it('delete should remove a promocion', async () => {
    const promocion: PromocionEntity = promocionesList[0];
    await service.delete(promocion.id);
     const deletedPromocion: PromocionEntity = await repository.findOne({ where: { id: promocion.id } })
    expect(deletedPromocion).toBeNull();
  });
  it('delete should throw an exception for an invalid promocion', async () => {
    const promocion: PromocionEntity = promocionesList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "Promocion no encontrada")
  });
});
