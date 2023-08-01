/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { Repository } from 'typeorm';
import { AdministradorEstablecimientoEntity } from '../administrador_establecimiento/administrador_establecimiento.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AdministradorEstablecimientoEstablecimientoService } from './administrador_establecimiento-establecimiento.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AdministradorEstablecimientoEstablecimientoService', () => {
  let service: AdministradorEstablecimientoEstablecimientoService;
  let administradorEstablecimientoRepository: Repository<AdministradorEstablecimientoEntity>;
  let establecimientoRepository: Repository<EstablecimientoEntity>;
  let administradorEstablecimiento: AdministradorEstablecimientoEntity;
  let establecimientosList : EstablecimientoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AdministradorEstablecimientoEstablecimientoService],
    }).compile();

    service = module.get<AdministradorEstablecimientoEstablecimientoService>(AdministradorEstablecimientoEstablecimientoService);
    administradorEstablecimientoRepository = module.get<Repository<AdministradorEstablecimientoEntity>>(getRepositoryToken(AdministradorEstablecimientoEntity));
    establecimientoRepository = module.get<Repository<EstablecimientoEntity>>(getRepositoryToken(EstablecimientoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    establecimientoRepository.clear();
    administradorEstablecimientoRepository.clear();

    establecimientosList = [];
    for(let i = 0; i < 5; i++){
        const establecimiento: EstablecimientoEntity = await establecimientoRepository.save({
          nombre: faker.company.name(),
          direccion: faker.address.secondaryAddress(),
          capacidad: Number(faker.random.numeric(2)),
          costoPromedio: Number(faker.random.numeric(3)),
          calificacionPromedio: Number(faker.random.numeric(1)),
          image: faker.image.imageUrl()
        })
        establecimientosList.push(establecimiento);
    }

    administradorEstablecimiento = await administradorEstablecimientoRepository.save({
      usuario: faker.internet.userName(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      establecimientos: establecimientosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addEstablecimientoAdministradorEstablecimiento should add an establecimiento to a administradorEstablecimiento', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(),
      capacidad: Number(faker.random.numeric(2)),
      costoPromedio: Number(faker.random.numeric(3)),
      calificacionPromedio: Number(faker.random.numeric(1)),
      image: faker.image.imageUrl()
    });

    const newAadministradorEstablecimiento: AdministradorEstablecimientoEntity = await administradorEstablecimientoRepository.save({
      usuario: faker.internet.userName(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      saldo: Number(faker.random.numeric(6))
    })

    const result: AdministradorEstablecimientoEntity = await service.addEstablecimientoAdministradorEstablecimiento(newAadministradorEstablecimiento.id, newEstablecimiento.id);
    
    expect(result.establecimientos.length).toBe(1);
    expect(result.establecimientos[0]).not.toBeNull();
    expect(result.establecimientos[0].nombre).toBe(newEstablecimiento.nombre)
    expect(result.establecimientos[0].direccion).toBe(newEstablecimiento.direccion)
    expect(result.establecimientos[0].capacidad).toBe(newEstablecimiento.capacidad)
    expect(result.establecimientos[0].costoPromedio).toBe(newEstablecimiento.costoPromedio)
    expect(result.establecimientos[0].calificacionPromedio).toBe(newEstablecimiento.calificacionPromedio)
  });

  it('addEstablecimientoAdministradorEstablecimiento should throw an exception for an invalid cliente', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(),
      capacidad: Number(faker.random.numeric(2)),
      costoPromedio: Number(faker.random.numeric(3)),
      calificacionPromedio: Number(faker.random.numeric(1)),
      image: faker.image.imageUrl()
    });

    await expect(() => service.addEstablecimientoAdministradorEstablecimiento("0", newEstablecimiento.id)).rejects.toHaveProperty("message", "The administradorEstablecimiento with the given id was not found");
  });

  it('findEstablecimientoByAdministradorEstablecimientoIdEstablecimientoId should return establecimiento by administradorEstablecimiento', async () => {
    const establecimiento: EstablecimientoEntity = establecimientosList[0];
    const storedEstablecimiento: EstablecimientoEntity = await service.findEstablecimientoByAdministradorEstablecimientoIdEstablecimientoId(administradorEstablecimiento.id, establecimiento.id )
    expect(storedEstablecimiento).not.toBeNull();
    expect(storedEstablecimiento.nombre).toStrictEqual(establecimiento.nombre)
    expect(storedEstablecimiento.direccion).toStrictEqual(establecimiento.direccion)
    expect(storedEstablecimiento.capacidad).toStrictEqual(establecimiento.capacidad)
    expect(storedEstablecimiento.costoPromedio).toStrictEqual(establecimiento.costoPromedio)
    expect(storedEstablecimiento.calificacionPromedio).toStrictEqual(establecimiento.calificacionPromedio)
    expect(storedEstablecimiento.image).toStrictEqual(establecimiento.image)
  });

  it('findEstablecimientoByAdministradorEstablecimientoIdEstablecimientoId should throw an exception for an invalid establecimiento', async () => {
    await expect(()=> service.findEstablecimientoByAdministradorEstablecimientoIdEstablecimientoId(administradorEstablecimiento.id, "0")).rejects.toHaveProperty("message", "The establecimiento with the given id was not found"); 
  });

  it('findEstablecimientoByAdministradorEstablecimientoIdEstablecimientoId should throw an exception for an invalid administradorEstablecimiento', async () => {
    const establecimiento: EstablecimientoEntity = establecimientosList[0]; 
    await expect(()=> service.findEstablecimientoByAdministradorEstablecimientoIdEstablecimientoId("0", establecimiento.id)).rejects.toHaveProperty("message", "The administradorEstablecimiento with the given id was not found"); 
  });

  it('findEstablecimientoByAdministradorEstablecimientoIdEstablecimientoId should throw an exception for an establecimiento not associated to the administradorEstablecimiento', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(),
      capacidad: Number(faker.random.numeric(2)),
      costoPromedio: Number(faker.random.numeric(3)),
      calificacionPromedio: Number(faker.random.numeric(1)),
      image: faker.image.imageUrl()
    });

    await expect(()=> service.findEstablecimientoByAdministradorEstablecimientoIdEstablecimientoId(administradorEstablecimiento.id, newEstablecimiento.id)).rejects.toHaveProperty("message", "The establecimiento with the given id is not associated to the administradorEstablecimiento"); 
  });

  it('findEstablecimientosByAdministradorEstablecimientoId should return establecimientos by administradorEstablecimiento', async ()=>{
    const establecimientos: EstablecimientoEntity[] = await service.findEstablecimientosByAdministradorEstablecimientoId(administradorEstablecimiento.id);
    expect(establecimientos.length).toBe(5)
  });

  it('findEstablecimientosByAdministradorEstablecimientoId should throw an exception for an invalid administradorEstablecimiento', async () => {
    await expect(()=> service.findEstablecimientosByAdministradorEstablecimientoId("0")).rejects.toHaveProperty("message", "The administradorEstablecimiento with the given id was not found"); 
  });

  it('associateEstablecimientosAdministradorEstablecimiento should update establecimientos list for a administradorEstablecimiento', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(),
      capacidad: Number(faker.random.numeric(2)),
      costoPromedio: Number(faker.random.numeric(3)),
      calificacionPromedio: Number(faker.random.numeric(1)),
      image: faker.image.imageUrl()
    });

    const updatedAdministradorEstablecimiento: AdministradorEstablecimientoEntity = await service.associateEstablecimientosAdministradorEstablecimiento(administradorEstablecimiento.id, [newEstablecimiento]);
    expect(updatedAdministradorEstablecimiento.establecimientos.length).toBe(1);

    expect(updatedAdministradorEstablecimiento.establecimientos[0].nombre).toBe(newEstablecimiento.nombre);
    expect(updatedAdministradorEstablecimiento.establecimientos[0].direccion).toBe(newEstablecimiento.direccion);
    expect(updatedAdministradorEstablecimiento.establecimientos[0].capacidad).toBe(newEstablecimiento.capacidad);
    expect(updatedAdministradorEstablecimiento.establecimientos[0].costoPromedio).toBe(newEstablecimiento.costoPromedio);
    expect(updatedAdministradorEstablecimiento.establecimientos[0].calificacionPromedio).toBe(newEstablecimiento.calificacionPromedio);
  });

  it('associateEstablecimientosAdministradorEstablecimiento should throw an exception for an invalid administradorEstablecimiento', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(),
      capacidad: Number(faker.random.numeric(2)),
      costoPromedio: Number(faker.random.numeric(3)),
      calificacionPromedio: Number(faker.random.numeric(1)),
      image: faker.image.imageUrl()
    });

    await expect(()=> service.associateEstablecimientosAdministradorEstablecimiento("0", [newEstablecimiento])).rejects.toHaveProperty("message", "The administradorEstablecimiento with the given id was not found"); 
  });

  it('associateEstablecimientosAdministradorEstablecimiento should throw an exception for an invalid establecimiento', async () => {
    const newEstablecimiento: EstablecimientoEntity = establecimientosList[0];
    newEstablecimiento.id = "0";

    await expect(()=> service.associateEstablecimientosAdministradorEstablecimiento(administradorEstablecimiento.id, [newEstablecimiento])).rejects.toHaveProperty("message", "The establecimiento with the given id was not found"); 
  });

  it('deleteEstablecimientoToAdministradorEstablecimiento should remove an establecimiento from a administradorEstablecimiento', async () => {
    const establecimiento: EstablecimientoEntity = establecimientosList[0];
    
    await service.deleteEstablecimientoAdministradorEstablecimiento(administradorEstablecimiento.id, establecimiento.id);

    const storedAdministradorEstablecimiento: AdministradorEstablecimientoEntity = await administradorEstablecimientoRepository.findOne({where: {id: administradorEstablecimiento.id}, relations: ["establecimientos"]});
    const deletedEstablecimiento: EstablecimientoEntity = storedAdministradorEstablecimiento.establecimientos.find(a => a.id === establecimiento.id);

    expect(deletedEstablecimiento).toBeUndefined();

  });

  it('deleteEstablecimientoToAdministradorEstablecimiento should thrown an exception for an invalid establecimiento', async () => {
    await expect(()=> service.deleteEstablecimientoAdministradorEstablecimiento(administradorEstablecimiento.id, "0")).rejects.toHaveProperty("message", "The establecimiento with the given id was not found"); 
  });

  it('deleteEstablecimientoToAdministradorEstablecimiento should thrown an exception for an invalid administradorEstablecimiento', async () => {
    const establecimiento: EstablecimientoEntity = establecimientosList[0];
    await expect(()=> service.deleteEstablecimientoAdministradorEstablecimiento("0", establecimiento.id)).rejects.toHaveProperty("message", "The administradorEstablecimiento with the given id was not found"); 
  });

  it('deleteEstablecimientoToAdministradorEstablecimiento should thrown an exception for an non asocciated establecimiento', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(),
      capacidad: Number(faker.random.numeric(2)),
      costoPromedio: Number(faker.random.numeric(3)),
      calificacionPromedio: Number(faker.random.numeric(1)),
      image: faker.image.imageUrl()
    });

    await expect(()=> service.deleteEstablecimientoAdministradorEstablecimiento(administradorEstablecimiento.id, newEstablecimiento.id)).rejects.toHaveProperty("message", "The establecimiento with the given id is not associated to the administradorEstablecimiento"); 
  }); 
});

