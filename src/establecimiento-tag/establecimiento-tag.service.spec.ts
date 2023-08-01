/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { TagEntity } from '../tag/tag.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EstablecimientoTagService } from './establecimiento-tag.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { AdministradorEstablecimientoEntity } from '../administrador_establecimiento/administrador_establecimiento.entity';

describe('EstablecimientoTagService', () => {
  let service: EstablecimientoTagService;
  let establecimientoRepository: Repository<EstablecimientoEntity>;
  let tagRepository: Repository<TagEntity>;
  let establecimiento: EstablecimientoEntity;
  let tagsList : TagEntity[];
  let repositotyAdmin: Repository<AdministradorEstablecimientoEntity>;
  let adminEsta: AdministradorEstablecimientoEntity;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstablecimientoTagService],
    }).compile();

    service = module.get<EstablecimientoTagService>(EstablecimientoTagService);
    establecimientoRepository = module.get<Repository<EstablecimientoEntity>>(getRepositoryToken(EstablecimientoEntity));
    tagRepository = module.get<Repository<TagEntity>>(getRepositoryToken(TagEntity));
    repositotyAdmin = module.get<Repository<AdministradorEstablecimientoEntity>>(getRepositoryToken(AdministradorEstablecimientoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    tagRepository.clear();
    establecimientoRepository.clear();
    repositotyAdmin.clear();

    adminEsta = await repositotyAdmin.save({
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      establecimientos: [],
    });
    tagsList = [];
    for(let i = 0; i < 5; i++){
        const tag: TagEntity = await tagRepository.save({
          nombre: faker.name.firstName()
        });
        tagsList.push(tag);
    }

    establecimiento = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      tagsEstablecimiento: tagsList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addTagEstablecimiento should add a tag to an establecimiento', async () => {
    const newTag: TagEntity = await tagRepository.save({
      nombre: faker.name.firstName(),
    });
      const tags: TagEntity[] = [];
      tags.push(newTag);

    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      tagsEstablecimiento: tags
    })

    const result: EstablecimientoEntity = await service.addTagEstablecimiento(newEstablecimiento.id, newTag.id);
    
    expect(result.tagsEstablecimiento.length).toBe(2);
    expect(result.tagsEstablecimiento[0].nombre).toBe(newTag.nombre);
  });

  it('addTagEstablecimiento should thrown exception for an invalid tag', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      tagsEstablecimiento: tagsList
    })

    await expect(() => service.addTagEstablecimiento(newEstablecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el tag con el tagId: ");
  });

  it('addTagEstablecimiento should throw an exception for an invalid establecimiento', async () => {
    const newTag: TagEntity = await tagRepository.save({
      nombre: faker.name.firstName()
    });

    await expect(() => service.addTagEstablecimiento("0", newTag.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: ");
  });

  it('findTagByEstablecimientoIdTagId should return tag by establecimiento', async () => {
    const tag: TagEntity = tagsList[0];
    const storedTag: TagEntity = await service.findTagByEstablecimientoIdTagId(establecimiento.id, tag.id, )
    expect(storedTag).not.toBeNull();
    expect(storedTag.nombre).toBe(tag.nombre);
  });

  it('findTagByEstablecimientoIdTagId should throw an exception for an invalid tag', async () => {
    await expect(()=> service.findTagByEstablecimientoIdTagId(establecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el tag con el tagId: "); 
  });

  it('findTagByEstablecimientoIdTagId should throw an exception for an invalid establecimiento', async () => {
    const tag: TagEntity = tagsList[0]; 
    await expect(()=> service.findTagByEstablecimientoIdTagId("0", tag.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('findTagByEstablecimientoIdTagId should throw an exception for a tag not associated to the establecimiento', async () => {
    const newTag: TagEntity = await tagRepository.save({
      nombre: faker.name.firstName()
    });

    await expect(()=> service.findTagByEstablecimientoIdTagId(establecimiento.id, newTag.id)).rejects.toHaveProperty("message", "El  tag con el id dado no esta asociado con el establecimiento"); 
  });

  it('findTagsByEstablecimientoId should return tags by establecimiento', async ()=>{
    const tags: TagEntity[] = await service.findTagsByEstablecimientoId(establecimiento.id);
    expect(tags.length).toBe(5)
  });

  it('findTagsByEstablecimientoId should throw an exception for an invalid establecimiento', async () => {
    await expect(()=> service.findTagsByEstablecimientoId("0")).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('associateTagsEstablecimiento should update tags list for an establecimiento', async () => {
    const newTag: TagEntity = await tagRepository.save({
      nombre: faker.name.firstName()
    });

    const updatedEstablecimiento: EstablecimientoEntity = await service.associateTagsEstablecimiento(establecimiento.id, [newTag]);
    expect(updatedEstablecimiento.tagsEstablecimiento.length).toBe(1);

    expect(updatedEstablecimiento.tagsEstablecimiento[0].nombre).toBe(newTag.nombre);
  });

  it('associateTagsEstablecimiento should throw an exception for an invalid establecimiento', async () => {
    const newTag: TagEntity = await tagRepository.save({
      nombre: faker.name.firstName()
    });

    await expect(()=> service.associateTagsEstablecimiento("0", [newTag])).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('associateTagsEstablecimiento should throw an exception for an invalid tag', async () => {
    const newTag: TagEntity = tagsList[0];
    newTag.id = "0";

    await expect(()=> service.associateTagsEstablecimiento(establecimiento.id, [newTag])).rejects.toHaveProperty("message", "No existe el tag con el tagId: "); 
  });

  it('deleteTagToEstablecimiento should remove a tag from an establecimiento', async () => {
    const tag: TagEntity = tagsList[0];
    
    await service.deleteTagEstablecimiento(establecimiento.id, tag.id);

    const storedEstablecimiento: EstablecimientoEntity = await establecimientoRepository.findOne({where: {id: establecimiento.id}, relations: ["tagsEstablecimiento"]});
    const deletedTag: TagEntity = storedEstablecimiento.tagsEstablecimiento.find(a => a.id === tag.id);

    expect(deletedTag).toBeUndefined();

  });

  it('deleteTagToEstablecimiento should thrown an exception for an invalid tag', async () => {
    await expect(()=> service.deleteTagEstablecimiento(establecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el tag con el tagId: "); 
  });

  it('deleteTagToEstablecimiento should thrown an exception for an invalid establecimiento', async () => {
    const tag: TagEntity = tagsList[0];
    await expect(()=> service.deleteTagEstablecimiento("0", tag.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('deleteTagToEstablecimiento should thrown an exception for an non asocciated tag', async () => {
    const newTag: TagEntity = await tagRepository.save({
      nombre: faker.name.firstName()
    });

    await expect(()=> service.deleteTagEstablecimiento(establecimiento.id, newTag.id)).rejects.toHaveProperty("message", "El  tag con el id dado no esta asociado con el establecimiento"); 
  }); 

});