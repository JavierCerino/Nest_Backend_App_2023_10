/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TagEntity } from '../tag/tag.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TagEstablecimientoService } from './tag-establecimiento.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { AdministradorEstablecimientoEntity } from '../administrador_establecimiento/administrador_establecimiento.entity';

describe('TagEstablecimientoService', () => {
  let service: TagEstablecimientoService;
  let tagRepository: Repository<TagEntity>;
  let establecimientoRepository: Repository<EstablecimientoEntity>;
  let tag: TagEntity;
  let establecimientosList : EstablecimientoEntity[];
  let repositotyAdmin: Repository<AdministradorEstablecimientoEntity>;
  let adminEsta: AdministradorEstablecimientoEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TagEstablecimientoService],
    }).compile();

    service = module.get<TagEstablecimientoService>(TagEstablecimientoService);
    tagRepository = module.get<Repository<TagEntity>>(getRepositoryToken(TagEntity));
    establecimientoRepository = module.get<Repository<EstablecimientoEntity>>(getRepositoryToken(EstablecimientoEntity));
    repositotyAdmin = module.get<Repository<AdministradorEstablecimientoEntity>>(getRepositoryToken(AdministradorEstablecimientoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    establecimientoRepository.clear();
    tagRepository.clear();
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
    establecimientosList = [];
    for(let i = 0; i < 5; i++){
        const establecimiento: EstablecimientoEntity = await establecimientoRepository.save({
          nombre: faker.name.firstName(),
          direccion: faker.address.streetAddress(),
          capacidad: +faker.random.numeric(),
          costoPromedio: +faker.random.numeric(),
          calificacionPromedio: +faker.random.numeric(),
          image: faker.image.imageUrl(),
          adminEst: adminEsta
        });
        establecimientosList.push(establecimiento);
    }

    tag = await tagRepository.save({
      nombre: faker.name.firstName(),
      establecimientos: establecimientosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addEstablecimientoTag should add a establecimiento to an tag', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta
    });
      const establecimientos: EstablecimientoEntity[] = [];
      establecimientos.push(newEstablecimiento);

    const newTag: TagEntity = await tagRepository.save({
      nombre: faker.name.firstName(),
      establecimientos: establecimientos
    })

    const result: TagEntity = await service.addEstablecimientoTag(newTag.id, newEstablecimiento.id);
    
    expect(result.establecimientos.length).toBe(2);
    expect(result.establecimientos[0].nombre).toBe(newEstablecimiento.nombre);
    expect(result.establecimientos[0].direccion).toBe(newEstablecimiento.direccion);
    expect(result.establecimientos[0].capacidad).toBe(newEstablecimiento.capacidad);
    expect(result.establecimientos[0].costoPromedio).toBe(newEstablecimiento.costoPromedio);
    expect(result.establecimientos[0].calificacionPromedio).toBe(newEstablecimiento.calificacionPromedio);
    expect(result.establecimientos[0].image).toBe(newEstablecimiento.image);
  });

  it('addEstablecimientoTag should thrown exception for an invalid establecimiento', async () => {
    const newTag: TagEntity = await tagRepository.save({
      nombre: faker.name.firstName(),
      establecimientos: establecimientosList
    })

    await expect(() => service.addEstablecimientoTag(newTag.id, "0")).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: ");
  });

  it('addEstablecimientoTag should throw an exception for an invalid tag', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta
    });

    await expect(() => service.addEstablecimientoTag("0", newEstablecimiento.id)).rejects.toHaveProperty("message", "No existe el tag con el tagId: ");
  });

  it('findEstablecimientoByTagIdEstablecimientoId should return establecimiento by tag', async () => {
    const establecimiento: EstablecimientoEntity = establecimientosList[0];
    const storedEstablecimiento: EstablecimientoEntity = await service.findEstablecimientoByTagIdEstablecimientoId(tag.id, establecimiento.id, )
    expect(storedEstablecimiento).not.toBeNull();
    expect(storedEstablecimiento.nombre).toBe(establecimiento.nombre);
    expect(storedEstablecimiento.direccion).toBe(establecimiento.direccion);
    expect(storedEstablecimiento.capacidad).toBe(establecimiento.capacidad);
    expect(storedEstablecimiento.costoPromedio).toBe(establecimiento.costoPromedio);
    expect(storedEstablecimiento.calificacionPromedio).toBe(establecimiento.calificacionPromedio);
    expect(storedEstablecimiento.image).toBe(establecimiento.image);
  });

  it('findEstablecimientoByTagIdEstablecimientoId should throw an exception for an invalid establecimiento', async () => {
    await expect(()=> service.findEstablecimientoByTagIdEstablecimientoId(tag.id, "0")).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('findEstablecimientoByTagIdEstablecimientoId should throw an exception for an invalid tag', async () => {
    const establecimiento: EstablecimientoEntity = establecimientosList[0]; 
    await expect(()=> service.findEstablecimientoByTagIdEstablecimientoId("0", establecimiento.id)).rejects.toHaveProperty("message", "No existe el tag con el tagId: "); 
  });

  it('findEstablecimientoByTagIdEstablecimientoId should throw an exception for a establecimiento not associated to the tag', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta
    });

    await expect(()=> service.findEstablecimientoByTagIdEstablecimientoId(tag.id, newEstablecimiento.id)).rejects.toHaveProperty("message", "El  establecimiento con el id dado no esta asociado con el tag"); 
  });

  it('findEstablecimientosByTagId should return establecimientos by tag', async ()=>{
    const establecimientos: EstablecimientoEntity[] = await service.findEstablecimientosByTagId(tag.id);
    expect(establecimientos.length).toBe(5)
  });

  it('findEstablecimientosByTagId should throw an exception for an invalid tag', async () => {
    await expect(()=> service.findEstablecimientosByTagId("0")).rejects.toHaveProperty("message", "No existe el tag con el tagId: "); 
  });

  it('associateEstablecimientosTag should update establecimientos list for an tag', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta
    });

    const updatedTag: TagEntity = await service.associateEstablecimientosTag(tag.id, [newEstablecimiento]);
    expect(updatedTag.establecimientos.length).toBe(1);

    expect(updatedTag.establecimientos[0].nombre).toBe(newEstablecimiento.nombre);
    expect(updatedTag.establecimientos[0].direccion).toBe(newEstablecimiento.direccion);
    expect(updatedTag.establecimientos[0].capacidad).toBe(newEstablecimiento.capacidad);
    expect(updatedTag.establecimientos[0].costoPromedio).toBe(newEstablecimiento.costoPromedio);
    expect(updatedTag.establecimientos[0].calificacionPromedio).toBe(newEstablecimiento.calificacionPromedio);
  });

  it('associateEstablecimientosTag should throw an exception for an invalid tag', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta
    });

    await expect(()=> service.associateEstablecimientosTag("0", [newEstablecimiento])).rejects.toHaveProperty("message", "No existe el tag con el tagId: "); 
  });

  it('associateEstablecimientosTag should throw an exception for an invalid establecimiento', async () => {
    const newEstablecimiento: EstablecimientoEntity = establecimientosList[0];
    newEstablecimiento.id = "0";

    await expect(()=> service.associateEstablecimientosTag(tag.id, [newEstablecimiento])).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('deleteEstablecimientoToTag should remove a establecimiento from an tag', async () => {
    const establecimiento: EstablecimientoEntity = establecimientosList[0];
    
    await service.deleteEstablecimientoTag(tag.id, establecimiento.id);

    const storedTag: TagEntity = await tagRepository.findOne({where: {id: tag.id}, relations: ["establecimientos"]});
    const deletedEstablecimiento: EstablecimientoEntity = storedTag.establecimientos.find(a => a.id === establecimiento.id);

    expect(deletedEstablecimiento).toBeUndefined();

  });

  it('deleteEstablecimientoToTag should thrown an exception for an invalid establecimiento', async () => {
    await expect(()=> service.deleteEstablecimientoTag(tag.id, "0")).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('deleteEstablecimientoToTag should thrown an exception for an invalid tag', async () => {
    const establecimiento: EstablecimientoEntity = establecimientosList[0];
    await expect(()=> service.deleteEstablecimientoTag("0", establecimiento.id)).rejects.toHaveProperty("message", "No existe el tag con el tagId: "); 
  });

  it('deleteEstablecimientoToTag should thrown an exception for an non asocciated establecimiento', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta
    });

    await expect(()=> service.deleteEstablecimientoTag(tag.id, newEstablecimiento.id)).rejects.toHaveProperty("message", "El  establecimiento con el id dado no esta asociado con el tag"); 
  }); 

});