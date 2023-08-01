/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ReseniaService } from './resenia.service';
import { ReseniaEntity } from './resenia.entity';
import { ClienteEntity } from '../cliente/cliente.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity'
import { faker } from '@faker-js/faker';

describe('ReseniaService', () => {
  let service: ReseniaService;
  let repository: Repository<ReseniaEntity>;
  let clienteRepository: Repository<ClienteEntity>;
  let establecimientoRepository: Repository<EstablecimientoEntity>;
  let reseniaList: ReseniaEntity[];
  let cliente : ClienteEntity;
  let establecimiento: EstablecimientoEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReseniaService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<ReseniaService>(ReseniaService);
    repository = module.get<Repository<ReseniaEntity>>(getRepositoryToken(ReseniaEntity));
    clienteRepository = module.get<Repository<ClienteEntity>>(getRepositoryToken(ClienteEntity));
    establecimientoRepository = module.get<Repository<EstablecimientoEntity>>(getRepositoryToken(EstablecimientoEntity));
    await seedDatabase();
  });

  // Funcion para seeding
  const seedDatabase = async () => {
    repository.clear();
    clienteRepository.clear();
    establecimientoRepository.clear();

    reseniaList = [];
    for (let i = 0; i < 5; i++) {
      const resenia: ReseniaEntity = await repository.save({
        tipo: faker.lorem.sentence(),
        descripcion: faker.lorem.sentence()
      })
      reseniaList.push(resenia);
    }

    cliente = await clienteRepository.save({
      perfilAdquisitivo: faker.datatype.number(),
      saldo: faker.datatype.number(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      resenias: reseniaList
    });

    establecimiento = await establecimientoRepository.save({
      nombre: faker.lorem.sentence(),
      direccion: faker.lorem.sentence(),
      capacidad: faker.datatype.number(),
      costoPromedio: faker.datatype.number(),
      calificacionPromedio: faker.datatype.number(),
      image: faker.image.imageUrl(),
      resenias: reseniaList
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all resenias', async () => {
    const resenias: ReseniaEntity[] = await service.findAll();
    expect(resenias).not.toBeNull();
    expect(resenias).toHaveLength(reseniaList.length);
  });

  it('findOne should return a resenia by id', async () => {
    const storedResenia: ReseniaEntity = reseniaList[0];
    const resenia: ReseniaEntity = await service.findOne(storedResenia.id);
    expect(resenia).not.toBeNull();
    expect(resenia.tipo).toEqual(storedResenia.tipo)
    expect(resenia.descripcion).toEqual(storedResenia.descripcion)
  });

  it('findOne should throw an exception for an invalid resenia', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The resenia with the given id was not found")
  });

  it('create should return a new resenia', async () => {
    const resenia: ReseniaEntity = {
      id: "",
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      cliente: undefined,
      establecimientos: undefined
    }

    const newResenia: ReseniaEntity = await service.create(resenia, cliente.id, establecimiento.id);
    expect(newResenia).not.toBeNull();

    const storedResenia: ReseniaEntity = await repository.findOne({ where: { id: newResenia.id } })
    expect(storedResenia).not.toBeNull();
    expect(storedResenia.descripcion).toEqual(newResenia.descripcion)
    expect(storedResenia.tipo).toEqual(newResenia.tipo)
  });

  it('create should throw an exception for an invalid cliente', async () => {
    const resenia: ReseniaEntity = {
      id: "",
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      cliente: undefined,
      establecimientos: undefined
    }

    await expect(() => service.create(resenia, "0", establecimiento.id)).rejects.toHaveProperty("message", "The cliente with the given id was not found")
  });

  it('create should throw an exception for an invalid establecimiento', async () => {
    const resenia: ReseniaEntity = {
      id: "",
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      cliente: undefined,
      establecimientos: undefined
    }

    await expect(() => service.create(resenia, cliente.id, "0")).rejects.toHaveProperty("message", "The establecimiento with the given id was not found")
  });


  it('update should modify a resenia', async () => {
    const resenia: ReseniaEntity = reseniaList[0];
    resenia.descripcion = "New description";
    resenia.tipo = "New tipo";
    const updatedResenia: ReseniaEntity = await service.update(resenia.id, resenia);
    expect(updatedResenia).not.toBeNull();
    const storedResenia: ReseniaEntity = await repository.findOne({ where: { id: resenia.id } })
    expect(storedResenia).not.toBeNull();
    expect(storedResenia.descripcion).toEqual(resenia.descripcion)
    expect(storedResenia.tipo).toEqual(resenia.tipo)
  });

  it('update should throw an exception for an invalid resenia', async () => {
    let resenia: ReseniaEntity = reseniaList[0];
    resenia = {
      ...resenia, descripcion: "New descripcion", tipo: "New tipo"
    }
    await expect(() => service.update("0", resenia)).rejects.toHaveProperty("message", "The resenia with the given id was not found")
  });

  it('delete should delete a resenia', async () => {
    const resenia: ReseniaEntity = reseniaList[0];
    await service.delete(resenia.id);
    const storedResenia: ReseniaEntity = await repository.findOne({ where: { id: resenia.id } })
    expect(storedResenia).toBeNull();
  });

  it('delete should throw an exception for an invalid resenia', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The resenia with the given id was not found")
  });

});
