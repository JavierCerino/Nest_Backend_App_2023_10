/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AdministradorEstablecimientoEntity } from './administrador_establecimiento.entity';
import { AdministradorEstablecimientoService } from './administrador_establecimiento.service';
import { faker } from '@faker-js/faker';

describe('AdministradorEstablecimientoService', () => {
  let service: AdministradorEstablecimientoService;
  let repository: Repository<AdministradorEstablecimientoEntity>;
  let administradorEstablecimientosList: AdministradorEstablecimientoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AdministradorEstablecimientoService],
    }).compile();
 
    service = module.get<AdministradorEstablecimientoService>(AdministradorEstablecimientoService);
    repository = module.get<Repository<AdministradorEstablecimientoEntity>>(getRepositoryToken(AdministradorEstablecimientoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    administradorEstablecimientosList = [];
    for(let i = 0; i < 5; i++){
      const administradorEstablecimiento: AdministradorEstablecimientoEntity = await repository.save({
      usuario: faker.internet.userName(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl()})
      administradorEstablecimientosList.push(administradorEstablecimiento);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all administradorEstablecimientos', async () => {
    const administradorEstablecimientos: AdministradorEstablecimientoEntity[] = await service.findAll();
    expect(administradorEstablecimientos).not.toBeNull();
    expect(administradorEstablecimientos).toHaveLength(administradorEstablecimientosList.length);
  });

  it('findOne should return an administradorEstablecimiento by id', async () => {
    const storedAdministradorEstablecimiento: AdministradorEstablecimientoEntity = administradorEstablecimientosList[0];
    const administradorEstablecimiento: AdministradorEstablecimientoEntity = await service.findOne(storedAdministradorEstablecimiento.id);
    expect(administradorEstablecimiento).not.toBeNull();
    expect(administradorEstablecimiento.usuario).toEqual(storedAdministradorEstablecimiento.usuario)
    expect(administradorEstablecimiento.nombre).toEqual(storedAdministradorEstablecimiento.nombre)
    expect(administradorEstablecimiento.apellido).toEqual(storedAdministradorEstablecimiento.apellido)
    expect(administradorEstablecimiento.contraseña).toEqual(storedAdministradorEstablecimiento.contraseña)
    expect(administradorEstablecimiento.correo).toEqual(storedAdministradorEstablecimiento.correo)
    expect(administradorEstablecimiento.image).toEqual(storedAdministradorEstablecimiento.image)
  });
 
  it('findOne should throw an exception for an invalid administradorEstablecimiento', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The administradorEstablecimiento with the given id was not found")
  });

  it('create should return a new administradorEstablecimiento', async () => {
    const administradorEstablecimiento: AdministradorEstablecimientoEntity = {
      id: "",
      usuario: faker.internet.userName(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      establecimientos: []
    }

    const newAdministradorEstablecimiento: AdministradorEstablecimientoEntity = await service.create(administradorEstablecimiento);
    expect(newAdministradorEstablecimiento).not.toBeNull();

    const storedAdministradorEstablecimiento: AdministradorEstablecimientoEntity = await repository.findOne({where: {id: newAdministradorEstablecimiento.id}})
    expect(storedAdministradorEstablecimiento).not.toBeNull();
    expect(storedAdministradorEstablecimiento.usuario).toEqual(newAdministradorEstablecimiento.usuario)
    expect(storedAdministradorEstablecimiento.nombre).toEqual(newAdministradorEstablecimiento.nombre)
    expect(storedAdministradorEstablecimiento.apellido).toEqual(newAdministradorEstablecimiento.apellido)
    expect(storedAdministradorEstablecimiento.contraseña).toEqual(newAdministradorEstablecimiento.contraseña)
    expect(storedAdministradorEstablecimiento.correo).toEqual(newAdministradorEstablecimiento.correo)
    expect(storedAdministradorEstablecimiento.image).toEqual(newAdministradorEstablecimiento.image)
  });

  it('update should modify an administradorCliente', async () => {
    const administradorEstablecimiento: AdministradorEstablecimientoEntity = administradorEstablecimientosList[0];
    administradorEstablecimiento.usuario = "New usuario";
    administradorEstablecimiento.contraseña = "New contraseña";
  
    const updatedAdministradorEstablecimiento: AdministradorEstablecimientoEntity = await service.update(administradorEstablecimiento.id, administradorEstablecimiento);
    expect(updatedAdministradorEstablecimiento).not.toBeNull();
  
    const storedAdministradorEstablecimiento: AdministradorEstablecimientoEntity = await repository.findOne({ where: { id: administradorEstablecimiento.id } })
    expect(storedAdministradorEstablecimiento).not.toBeNull();
    expect(storedAdministradorEstablecimiento.usuario).toEqual(administradorEstablecimiento.usuario)
    expect(storedAdministradorEstablecimiento.contraseña).toEqual(administradorEstablecimiento.contraseña)
  });

  it('update should throw an exception for an invalid administradorEstablecimiento', async () => {
    let administradorEstablecimiento: AdministradorEstablecimientoEntity = administradorEstablecimientosList[0];
    administradorEstablecimiento = {
      ...administradorEstablecimiento, usuario: "New usuario", contraseña: "New contraseña"
    }
    await expect(() => service.update("0", administradorEstablecimiento)).rejects.toHaveProperty("message", "The administradorEstablecimiento with the given id was not found")
  });

  it('delete should remove an administradorEstablecimiento', async () => {
    const administradorEstablecimiento: AdministradorEstablecimientoEntity = administradorEstablecimientosList[0];
    await service.delete(administradorEstablecimiento.id);
  
    const deletedAdministradorEstablecimiento: AdministradorEstablecimientoEntity = await repository.findOne({ where: { id: administradorEstablecimiento.id } })
    expect(deletedAdministradorEstablecimiento).toBeNull();
  });

  it('delete should throw an exception for an invalid administradorEstablecimiento', async () => {
    const administradorEstablecimiento: AdministradorEstablecimientoEntity = administradorEstablecimientosList[0];
    await service.delete(administradorEstablecimiento.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The administradorEstablecimiento with the given id was not found")
  });

});