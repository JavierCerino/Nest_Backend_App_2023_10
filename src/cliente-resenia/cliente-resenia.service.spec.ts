/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ReseniaEntity } from '../resenia/resenia.entity';
import { Repository } from 'typeorm';
import { ClienteEntity } from '../cliente/cliente.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClienteReseniaService } from './cliente-resenia.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClienteReseniaService', () => {
  let service: ClienteReseniaService;
  let clienteRepository: Repository<ClienteEntity>;
  let reseniaRepository: Repository<ReseniaEntity>;
  let cliente: ClienteEntity;
  let reseniasList : ReseniaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClienteReseniaService],
    }).compile();

    service = module.get<ClienteReseniaService>(ClienteReseniaService);
    clienteRepository = module.get<Repository<ClienteEntity>>(getRepositoryToken(ClienteEntity));
    reseniaRepository = module.get<Repository<ReseniaEntity>>(getRepositoryToken(ReseniaEntity));
    
    await seedDatabase();
  });

  const seedDatabase = async () => {
    reseniaRepository.clear();
    clienteRepository.clear();

    reseniasList = [];
    for(let i = 0; i < 5; i++){
        const resenia: ReseniaEntity = await reseniaRepository.save({
          tipo: faker.lorem.sentence(),
          descripcion: faker.lorem.sentence()
        })
        reseniasList.push(resenia);
    }

    cliente = await clienteRepository.save({
      usuario: faker.internet.userName(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: Number(faker.random.numeric(6)),
      saldo: Number(faker.random.numeric(6)),
      resenias: reseniasList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addReseniaCliente should add an resenia to a cliente', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    const newCliente: ClienteEntity = await clienteRepository.save({
      usuario: faker.internet.userName(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: Number(faker.random.numeric(6)),
      saldo: Number(faker.random.numeric(6))
    })
    const result: ClienteEntity = await service.addReseniaCliente(newCliente.id, newResenia.id);
    
    expect(result.resenias.length).toBe(1);
    expect(result.resenias[0]).not.toBeNull();
    expect(result.resenias[0].tipo).toBe(newResenia.tipo)
    expect(result.resenias[0].descripcion).toBe(newResenia.descripcion)
  });

  it('addReseniaCliente should throw an exception for an invalid cliente', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    await expect(() => service.addReseniaCliente("0", newResenia.id)).rejects.toHaveProperty("message", "The cliente with the given id was not found");
  });

  it('findReseniaByClienteIdReseniaId should return resenia by cliente', async () => {
    const resenia: ReseniaEntity = reseniasList[0];
    const storedResenia: ReseniaEntity = await service.findReseniaByClienteIdReseniaId(cliente.id, resenia.id, )
    expect(storedResenia).not.toBeNull();
    expect(storedResenia.tipo).toStrictEqual(resenia.tipo)
    expect(storedResenia.descripcion).toBe(resenia.descripcion)
  });

  it('findReseniaByClienteIdReseniaId should throw an exception for an invalid resenia', async () => {
    await expect(()=> service.findReseniaByClienteIdReseniaId(cliente.id, "0")).rejects.toHaveProperty("message", "The resenia with the given id was not found"); 
  });

  it('findReseniaByMuseumIdReseniaId should throw an exception for an invalid cliente', async () => {
    const resenia: ReseniaEntity = reseniasList[0]; 
    await expect(()=> service.findReseniaByClienteIdReseniaId("0", resenia.id)).rejects.toHaveProperty("message", "The cliente with the given id was not found"); 
  });

  it('findReseniaByClienteIdReseniaId should throw an exception for an resenia not associated to the cliente', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    await expect(()=> service.findReseniaByClienteIdReseniaId(cliente.id, newResenia.id)).rejects.toHaveProperty("message", "The resenia with the given id is not associated to the cliente"); 
  });

  it('findReseniasByClienteId should return resenias by cliente', async ()=>{
    const resenias: ReseniaEntity[] = await service.findReseniasByClienteId(cliente.id);
    expect(resenias.length).toBe(5)
  });

  it('findReseniasByClienteId should throw an exception for an invalid cliente', async () => {
    await expect(()=> service.findReseniasByClienteId("0")).rejects.toHaveProperty("message", "The cliente with the given id was not found"); 
  });
  
  it('associateReseniasCliente should update resenias list for a cliente', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    const updatedCliente: ClienteEntity = await service.associateReseniasCliente(cliente.id, [newResenia]);
    expect(updatedCliente.resenias.length).toBe(1);

    expect(updatedCliente.resenias[0].tipo).toBe(newResenia.tipo);
    expect(updatedCliente.resenias[0].descripcion).toBe(newResenia.descripcion);
  });

  it('associateReseniasCliente should throw an exception for an invalid cliente', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    await expect(()=> service.associateReseniasCliente("0", [newResenia])).rejects.toHaveProperty("message", "The cliente with the given id was not found"); 
  });

  it('associateReseniasCliente should throw an exception for an invalid resenia', async () => {
    const newResenia: ReseniaEntity = reseniasList[0];
    newResenia.id = "0";

    await expect(()=> service.associateReseniasCliente(cliente.id, [newResenia])).rejects.toHaveProperty("message", "The resenia with the given id was not found"); 
  });

  it('deleteReseniaToCliente should remove an resenia from a cliente', async () => {
    const resenia: ReseniaEntity = reseniasList[0];
    
    await service.deleteReseniaCliente(cliente.id, resenia.id);

    const storedCliente: ClienteEntity = await clienteRepository.findOne({where: {id: cliente.id}, relations: ["resenias"]});
    const deletedResenia: ReseniaEntity = storedCliente.resenias.find(a => a.id === resenia.id);

    expect(deletedResenia).toBeUndefined();

  });

  it('deleteReseniaToCliente should thrown an exception for an invalid resenia', async () => {
    await expect(()=> service.deleteReseniaCliente(cliente.id, "0")).rejects.toHaveProperty("message", "The resenia with the given id was not found"); 
  });

  it('deleteReseniaToCliente should thrown an exception for an invalid cliente', async () => {
    const resenia: ReseniaEntity = reseniasList[0];
    await expect(()=> service.deleteReseniaCliente("0", resenia.id)).rejects.toHaveProperty("message", "The cliente with the given id was not found"); 
  });

  it('deleteReseniaToCliente should thrown an exception for an non asocciated resenia', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    await expect(()=> service.deleteReseniaCliente(cliente.id, newResenia.id)).rejects.toHaveProperty("message", "The resenia with the given id is not associated to the cliente"); 
  }); 

});