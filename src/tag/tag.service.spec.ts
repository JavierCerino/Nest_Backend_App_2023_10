/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TagEntity } from './tag.entity';
import { faker } from '@faker-js/faker';

describe('TagService', () => {
  let service: TagService;
  let repository: Repository<TagEntity>;
  let tagsList;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TagService],
    }).compile();

    service = module.get<TagService>(TagService);
    repository = module.get<Repository<TagEntity>>(
      getRepositoryToken(TagEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tagsList = [];
    for (let i = 0; i < 5; i++) {
      const tag: TagEntity = await repository.save({
        nombre: faker.name.firstName(),
        direccion: faker.address.streetAddress(),
        capacidad: +faker.random.numeric(),
        costoPromedio: +faker.random.numeric(),
        calificacionPromedio: +faker.random.numeric(),
      });
      tagsList.push(tag);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all tags', async () => {
    const tags: TagEntity[] = await service.findAll();
    expect(tags).not.toBeNull();
    expect(tags).toHaveLength(tagsList.length);
  });

  it('findOne should return one tag', async () => {
    const storedTag: TagEntity = tagsList[0];
    const tag: TagEntity = await service.findOne(storedTag.id);
    expect(tag).not.toBeNull();
    expect(tag.nombre).toEqual(storedTag.nombre);
  });

  it('findOne should throw an exception for an invalid tag', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No existe el tag con el tagId: 0")
  });

  it('create should create a new tag', async () => {

    
    const newTag: TagEntity = await service.create({
      id: '',
      nombre: faker.name.firstName(),
      establecimientos: [],
      clientes: [],
    });
    expect(newTag).not.toBeNull();
    expect(newTag.nombre).not.toBeNull();
  });

  it('update should modify a tag', async () => {
    const tag: TagEntity = tagsList[0];
    tag.nombre = 'New name';
    const updatedTag: TagEntity = await service.update(
      tag.id,
      tag,
    );
    expect(updatedTag).not.toBeNull();
    const storedTag: TagEntity =
      await repository.findOne({ where: { id: tag.id } });
    expect(storedTag).not.toBeNull();
    expect(storedTag.nombre).toEqual(tag.nombre);
  });

  it('update should throw an exception for an invalid tag', async () => {
    let tag: TagEntity = tagsList[0];
    tag = {
      ...tag,nombre: 'New name',
    };
    await expect(() => service.update('0', tag)).rejects.toHaveProperty('message','No existe el tag con el tagId: 0');
  });

  it('delete should delete a tag', async () => {
    const tag: TagEntity = tagsList[0];
    await service.delete(tag.id);
    const deletedTag: TagEntity = await repository.findOne({ where: { id: tag.id } });
    expect(deletedTag).toBeNull();
  });

  it('delete should throw an exception for an invalid tag', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty('message','No existe el tag con el tagId: 0');
  });
});
