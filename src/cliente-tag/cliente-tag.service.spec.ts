/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TagEntity } from '../tag/tag.entity';
import { Repository } from 'typeorm';
import { ClienteEntity } from '../cliente/cliente.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClienteTagService } from './cliente-tag.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClienteTagService', () => {
  let service: ClienteTagService;
  let clienteRepository: Repository<ClienteEntity>;
  let tagRepository: Repository<TagEntity>;
  let cliente: ClienteEntity;
  let tagsList : TagEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClienteTagService],
    }).compile();

    service = module.get<ClienteTagService>(ClienteTagService);
    clienteRepository = module.get<Repository<ClienteEntity>>(getRepositoryToken(ClienteEntity));
    tagRepository = module.get<Repository<TagEntity>>(getRepositoryToken(TagEntity));

    await seedDatabase();
  });
  
  const seedDatabase = async () => {
    tagRepository.clear();
    clienteRepository.clear();

    tagsList = [];
    for(let i = 0; i < 5; i++){
        const tag: TagEntity = await tagRepository.save({
          nombre: faker.commerce.department()
        })
        tagsList.push(tag);
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
      tagsCliente: tagsList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addTagCliente should add an tag to a cliente', async () => {
    const newTag: TagEntity = await tagRepository.save({
      nombre: faker.commerce.department()
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
    const result: ClienteEntity = await service.addTagCliente(newCliente.id, newTag.id);
    
    expect(result.tagsCliente.length).toBe(1);
    expect(result.tagsCliente[0]).not.toBeNull();
    expect(result.tagsCliente[0].nombre).toBe(newTag.nombre)
  });

  it('addTagCliente should throw an exception for an invalid cliente', async () => {
    const newTag: TagEntity = await tagRepository.save({
      nombre: faker.commerce.department()
    });

    await expect(() => service.addTagCliente("0", newTag.id)).rejects.toHaveProperty("message", "The cliente with the given id was not found");
  });

  it('findTagByClienteIdTagId should return tag by cliente', async () => {
    const tag: TagEntity = tagsList[0];
    const storedTag: TagEntity = await service.findTagByClienteIdTagId(cliente.id, tag.id, )
    expect(storedTag).not.toBeNull();
    expect(storedTag.nombre).toBe(tag.nombre)
  });

  it('findTagByClienteIdTagId should throw an exception for an invalid tag', async () => {
    await expect(()=> service.findTagByClienteIdTagId(cliente.id, "0")).rejects.toHaveProperty("message", "The tag with the given id was not found"); 
  });

  it('findTagByMuseumIdTagId should throw an exception for an invalid cliente', async () => {
    const tag: TagEntity = tagsList[0]; 
    await expect(()=> service.findTagByClienteIdTagId("0", tag.id)).rejects.toHaveProperty("message", "The cliente with the given id was not found"); 
  });

  it('findTagByClienteIdTagId should throw an exception for an tag not associated to the cliente', async () => {
    const newTag: TagEntity = await tagRepository.save({
      nombre: faker.commerce.department()
    });

    await expect(()=> service.findTagByClienteIdTagId(cliente.id, newTag.id)).rejects.toHaveProperty("message", "The tag with the given id is not associated to the cliente"); 
  });

  it('findTagsByClienteId should return tags by cliente', async ()=>{
    const tags: TagEntity[] = await service.findTagsByClienteId(cliente.id);
    expect(tags.length).toBe(5)
  });

  it('findTagsByClienteId should throw an exception for an invalid cliente', async () => {
    await expect(()=> service.findTagsByClienteId("0")).rejects.toHaveProperty("message", "The cliente with the given id was not found"); 
  });

  it('associateTagsCliente should update tags list for a cliente', async () => {
    const newTag: TagEntity = await tagRepository.save({
      nombre: faker.commerce.department()
    });

    const updatedCliente: ClienteEntity = await service.associateTagsCliente(cliente.id, [newTag]);
    expect(updatedCliente.tagsCliente.length).toBe(1);

    expect(updatedCliente.tagsCliente[0].nombre).toBe(newTag.nombre);
  });

  it('associateTagsCliente should throw an exception for an invalid cliente', async () => {
    const newTag: TagEntity = await tagRepository.save({
      nombre: faker.commerce.department()
    });

    await expect(()=> service.associateTagsCliente("0", [newTag])).rejects.toHaveProperty("message", "The cliente with the given id was not found"); 
  });

  it('associateTagsCliente should throw an exception for an invalid tag', async () => {
    const newTag: TagEntity = tagsList[0];
    newTag.id = "0";

    await expect(()=> service.associateTagsCliente(cliente.id, [newTag])).rejects.toHaveProperty("message", "The tag with the given id was not found"); 
  });

  it('deleteTagToCliente should remove an tag from a cliente', async () => {
    const tag: TagEntity = tagsList[0];
    
    await service.deleteTagCliente(cliente.id, tag.id);

    const storedCliente: ClienteEntity = await clienteRepository.findOne({where: {id: cliente.id}, relations: ["tagsCliente"]});
    const deletedTag: TagEntity = storedCliente.tagsCliente.find(a => a.id === tag.id);

    expect(deletedTag).toBeUndefined();

  });

  it('deleteTagToCliente should thrown an exception for an invalid tag', async () => {
    await expect(()=> service.deleteTagCliente(cliente.id, "0")).rejects.toHaveProperty("message", "The tag with the given id was not found"); 
  });

  it('deleteTagToCliente should thrown an exception for an invalid cliente', async () => {
    const tag: TagEntity = tagsList[0];
    await expect(()=> service.deleteTagCliente("0", tag.id)).rejects.toHaveProperty("message", "The cliente with the given id was not found"); 
  });

  it('deleteTagToCliente should thrown an exception for an non asocciated tag', async () => {
    const newTag: TagEntity = await tagRepository.save({
      nombre: faker.commerce.department()
    });

    await expect(()=> service.deleteTagCliente(cliente.id, newTag.id)).rejects.toHaveProperty("message", "The tag with the given id is not associated to the cliente"); 
  }); 

});
