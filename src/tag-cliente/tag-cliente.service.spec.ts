/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TagEntity } from '../tag/tag.entity';
import { ClienteEntity } from '../cliente/cliente.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TagClienteService } from './tag-cliente.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('TagClienteService', () => {
  let service: TagClienteService;
  let tagRepository: Repository<TagEntity>;
  let clienteRepository: Repository<ClienteEntity>;
  let tag: TagEntity;
  let clientesList : ClienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TagClienteService],
    }).compile();

    service = module.get<TagClienteService>(TagClienteService);
    tagRepository = module.get<Repository<TagEntity>>(getRepositoryToken(TagEntity));
    clienteRepository = module.get<Repository<ClienteEntity>>(getRepositoryToken(ClienteEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    clienteRepository.clear();
    tagRepository.clear();

    clientesList = [];
    for(let i = 0; i < 5; i++){
        const cliente: ClienteEntity = await clienteRepository.save({
          nombre: faker.name.firstName(),
          apellido: faker.name.lastName(),
          usuario: faker.internet.userName(),
          contraseña: faker.internet.password(),
          correo: faker.internet.email(),
          image: faker.image.imageUrl(),
          perfilAdquisitivo: parseInt(faker.random.numeric()),
          saldo: parseInt(faker.random.numeric())
        });
        clientesList.push(cliente);
    }

    tag = await tagRepository.save({
      nombre: faker.name.firstName(),
      clientes: clientesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addClienteTag should add a cliente to an tag', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: parseInt(faker.random.numeric()),
      saldo: parseInt(faker.random.numeric())
    });
      const clientes: ClienteEntity[] = [];
      clientes.push(newCliente);

    const newTag: TagEntity = await tagRepository.save({
      nombre: faker.name.firstName(),
      clientes: clientes
    })

    const result: TagEntity = await service.addClienteTag(newTag.id, newCliente.id);
    
    expect(result.clientes.length).toBe(2);
    expect(result.clientes[0].nombre).toBe(newCliente.nombre);
    expect(result.clientes[0].apellido).toBe(newCliente.apellido);
    expect(result.clientes[0].usuario).toBe(newCliente.usuario);
    expect(result.clientes[0].contraseña).toBe(newCliente.contraseña);
    expect(result.clientes[0].correo).toBe(newCliente.correo);
    expect(result.clientes[0].image).toBe(newCliente.image);
    expect(result.clientes[0].saldo).toBe(newCliente.saldo);
    expect(result.clientes[0].perfilAdquisitivo).toBe(newCliente.perfilAdquisitivo);
  });

  it('addClienteTag should thrown exception for an invalid cliente', async () => {
    const newTag: TagEntity = await tagRepository.save({
      nombre: faker.name.firstName(),
      clientes: clientesList
    })

    await expect(() => service.addClienteTag(newTag.id, "0")).rejects.toHaveProperty("message", "No existe el cliente con el clienteId: ");
  });

  it('addClienteTag should throw an exception for an invalid tag', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: parseInt(faker.random.numeric()),
      saldo: parseInt(faker.random.numeric())
    });

    await expect(() => service.addClienteTag("0", newCliente.id)).rejects.toHaveProperty("message", "No existe el tag con el tagId: ");
  });

  it('findClienteByTagIdClienteId should return cliente by tag', async () => {
    const cliente: ClienteEntity = clientesList[0];
    const storedCliente: ClienteEntity = await service.findClienteByTagIdClienteId(tag.id, cliente.id, )
    expect(storedCliente).not.toBeNull();
    expect(storedCliente.nombre).toBe(cliente.nombre);
    expect(storedCliente.apellido).toBe(cliente.apellido);
    expect(storedCliente.usuario).toBe(cliente.usuario);
    expect(storedCliente.contraseña).toBe(cliente.contraseña);
    expect(storedCliente.correo).toBe(cliente.correo);
    expect(storedCliente.image).toBe(cliente.image);
    expect(storedCliente.saldo).toBe(cliente.saldo);
    expect(storedCliente.perfilAdquisitivo).toBe(cliente.perfilAdquisitivo);
  });

  it('findClienteByTagIdClienteId should throw an exception for an invalid cliente', async () => {
    await expect(()=> service.findClienteByTagIdClienteId(tag.id, "0")).rejects.toHaveProperty("message", "No existe el cliente con el clienteId: "); 
  });

  it('findClienteByTagIdClienteId should throw an exception for an invalid tag', async () => {
    const cliente: ClienteEntity = clientesList[0]; 
    await expect(()=> service.findClienteByTagIdClienteId("0", cliente.id)).rejects.toHaveProperty("message", "No existe el tag con el tagId: "); 
  });

  it('findClienteByTagIdClienteId should throw an exception for a cliente not associated to the tag', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: parseInt(faker.random.numeric()),
      saldo: parseInt(faker.random.numeric())
    });

    await expect(()=> service.findClienteByTagIdClienteId(tag.id, newCliente.id)).rejects.toHaveProperty("message", "El  cliente con el id dado no esta asociado con el tag"); 
  });

  it('findClientesByTagId should return clientes by tag', async ()=>{
    const clientes: ClienteEntity[] = await service.findClientesByTagId(tag.id);
    expect(clientes.length).toBe(5)
  });

  it('findClientesByTagId should throw an exception for an invalid tag', async () => {
    await expect(()=> service.findClientesByTagId("0")).rejects.toHaveProperty("message", "No existe el tag con el tagId: "); 
  });

  it('associateClientesTag should update clientes list for an tag', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: parseInt(faker.random.numeric()),
      saldo: parseInt(faker.random.numeric())
    });

    const updatedTag: TagEntity = await service.associateClientesTag(tag.id, [newCliente]);
    expect(updatedTag.clientes.length).toBe(1);

    expect(updatedTag.clientes[0].nombre).toBe(newCliente.nombre);
    expect(updatedTag.clientes[0].apellido).toBe(newCliente.apellido);
    expect(updatedTag.clientes[0].contraseña).toBe(newCliente.contraseña);
    expect(updatedTag.clientes[0].usuario).toBe(newCliente.usuario);
    expect(updatedTag.clientes[0].correo).toBe(newCliente.correo);
    expect(updatedTag.clientes[0].image).toBe(newCliente.image);
    expect(updatedTag.clientes[0].saldo).toBe(newCliente.saldo);
    expect(updatedTag.clientes[0].perfilAdquisitivo).toBe(newCliente.perfilAdquisitivo);
  });

  it('associateClientesTag should throw an exception for an invalid tag', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: parseInt(faker.random.numeric()),
      saldo: parseInt(faker.random.numeric())
    });

    await expect(()=> service.associateClientesTag("0", [newCliente])).rejects.toHaveProperty("message", "No existe el tag con el tagId: "); 
  });

  it('associateClientesTag should throw an exception for an invalid cliente', async () => {
    const newCliente: ClienteEntity = clientesList[0];
    newCliente.id = "0";

    await expect(()=> service.associateClientesTag(tag.id, [newCliente])).rejects.toHaveProperty("message", "No existe el cliente con el clienteId: "); 
  });

  it('deleteClienteToTag should remove a cliente from an tag', async () => {
    const cliente: ClienteEntity = clientesList[0];
    
    await service.deleteClienteTag(tag.id, cliente.id);

    const storedTag: TagEntity = await tagRepository.findOne({where: {id: tag.id}, relations: ["clientes"]});
    const deletedCliente: ClienteEntity = storedTag.clientes.find(a => a.id === cliente.id);

    expect(deletedCliente).toBeUndefined();

  });

  it('deleteClienteToTag should thrown an exception for an invalid cliente', async () => {
    await expect(()=> service.deleteClienteTag(tag.id, "0")).rejects.toHaveProperty("message", "No existe el cliente con el clienteId: "); 
  });

  it('deleteClienteToTag should thrown an exception for an invalid tag', async () => {
    const cliente: ClienteEntity = clientesList[0];
    await expect(()=> service.deleteClienteTag("0", cliente.id)).rejects.toHaveProperty("message", "No existe el tag con el tagId: "); 
  });

  it('deleteClienteToTag should thrown an exception for an non asocciated cliente', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: parseInt(faker.random.numeric()),
      saldo: parseInt(faker.random.numeric())
    });

    await expect(()=> service.deleteClienteTag(tag.id, newCliente.id)).rejects.toHaveProperty("message", "El  cliente con el id dado no esta asociado con el tag"); 
  }); 

});