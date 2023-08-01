/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClienteEntity } from './cliente.entity';
import { ClienteService } from './cliente.service';
import { faker } from '@faker-js/faker';

describe('ClienteService', () => {
  let service: ClienteService;
  let repository: Repository<ClienteEntity>;
  let clientesList: ClienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClienteService],
    }).compile();
 
    service = module.get<ClienteService>(ClienteService);
    repository = module.get<Repository<ClienteEntity>>(getRepositoryToken(ClienteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    clientesList = [];
    for(let i = 0; i < 5; i++){
      const cliente: ClienteEntity = await repository.save({
      usuario: faker.internet.userName(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: Number(faker.random.numeric(6)),
      saldo: Number(faker.random.numeric(6)) })
      clientesList.push(cliente);
    }
  }
   
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all clientes', async () => {
    const clientes: ClienteEntity[] = await service.findAll();
    expect(clientes).not.toBeNull();
    expect(clientes).toHaveLength(clientesList.length);
  });

  it('findOne should return a cliente by id', async () => {
    const storedCliente: ClienteEntity = clientesList[0];
    const cliente: ClienteEntity = await service.findOne(storedCliente.id);
    expect(cliente).not.toBeNull();
    expect(cliente.usuario).toEqual(storedCliente.usuario)
    expect(cliente.nombre).toEqual(storedCliente.nombre)
    expect(cliente.apellido).toEqual(storedCliente.apellido)
    expect(cliente.contraseña).toEqual(storedCliente.contraseña)
    expect(cliente.correo).toEqual(storedCliente.correo)
    expect(cliente.image).toEqual(storedCliente.image)
    expect(cliente.perfilAdquisitivo).toEqual(storedCliente.perfilAdquisitivo)
    expect(cliente.saldo).toEqual(storedCliente.saldo)
  });

  it('findOne should throw an exception for an invalid cliente', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The cliente with the given id was not found")
  });

  it('create should return a new cliente', async () => {
    const cliente: ClienteEntity = {
      id: "",
      usuario: faker.internet.userName(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: Number(faker.random.numeric(6)),
      saldo: Number(faker.random.numeric(6)),
      reservasAsignadas: [],
      resenias: [],
      establecimientosFav: [],
      tagsCliente: []
    }

    const newCliente: ClienteEntity = await service.create(cliente);
    expect(newCliente).not.toBeNull();

    const storedCliente: ClienteEntity = await repository.findOne({where: {id: newCliente.id}})
    expect(storedCliente).not.toBeNull();
    expect(storedCliente.usuario).toEqual(newCliente.usuario)
    expect(storedCliente.nombre).toEqual(newCliente.nombre)
    expect(storedCliente.apellido).toEqual(newCliente.apellido)
    expect(storedCliente.contraseña).toEqual(newCliente.contraseña)
    expect(storedCliente.correo).toEqual(newCliente.correo)
    expect(storedCliente.image).toEqual(newCliente.image)
    expect(storedCliente.perfilAdquisitivo).toEqual(newCliente.perfilAdquisitivo)
    expect(storedCliente.saldo).toEqual(newCliente.saldo)
  });

  it('update should modify a cliente', async () => {
    const cliente: ClienteEntity = clientesList[0];
    cliente.usuario = "New usuario";
    cliente.contraseña = "New contraseña";
    cliente.saldo = 100000;
  
    const updatedCliente: ClienteEntity = await service.update(cliente.id, cliente);
    expect(updatedCliente).not.toBeNull();
  
    const storedCliente: ClienteEntity = await repository.findOne({ where: { id: cliente.id } })
    expect(storedCliente).not.toBeNull();
    expect(storedCliente.usuario).toEqual(cliente.usuario)
    expect(storedCliente.contraseña).toEqual(cliente.contraseña)
    expect(storedCliente.saldo).toEqual(cliente.saldo)
  });

  it('update should throw an exception for an invalid cliente', async () => {
    let cliente: ClienteEntity = clientesList[0];
    cliente = {
      ...cliente, usuario: "New usuario", contraseña: "New contraseña", saldo: 100000
    }
    await expect(() => service.update("0", cliente)).rejects.toHaveProperty("message", "The cliente with the given id was not found")
  });

  it('delete should remove an cliente', async () => {
    const cliente: ClienteEntity = clientesList[0];
    await service.delete(cliente.id);
  
    const deletedCliente: ClienteEntity = await repository.findOne({ where: { id: cliente.id } })
    expect(deletedCliente).toBeNull();
  });

  it('delete should throw an exception for an invalid cliente', async () => {
    const cliente: ClienteEntity = clientesList[0];
    await service.delete(cliente.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The cliente with the given id was not found")
  });
 
 });