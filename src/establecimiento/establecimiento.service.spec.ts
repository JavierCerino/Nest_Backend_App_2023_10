/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { EstablecimientoService } from './establecimiento.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EstablecimientoEntity } from './establecimiento.entity';
import { faker } from '@faker-js/faker';
import { AdministradorEstablecimientoEntity } from '../administrador_establecimiento/administrador_establecimiento.entity';

describe('EstablecimientoService', () => {
  let service: EstablecimientoService;
  let repository: Repository<EstablecimientoEntity>;
  let repositotyAdmin: Repository<AdministradorEstablecimientoEntity>;
  let adminEsta: AdministradorEstablecimientoEntity;
  let establecimientosList;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstablecimientoService],
    }).compile();

    service = module.get<EstablecimientoService>(EstablecimientoService);
    repository = module.get<Repository<EstablecimientoEntity>>(getRepositoryToken(EstablecimientoEntity));
    repositotyAdmin = module.get<Repository<AdministradorEstablecimientoEntity>>(getRepositoryToken(AdministradorEstablecimientoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    establecimientosList = [];
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

    for (let i = 0; i < 5; i++) {
      const establecimiento: EstablecimientoEntity = await repository.save({
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
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all establecimientos', async () => {
    const establecimientos: EstablecimientoEntity[] = await service.findAll();
    expect(establecimientos).not.toBeNull();
    expect(establecimientos).toHaveLength(establecimientosList.length);
  });

  it('findOne should return one establecimiento', async () => {
    const storedEstablecimiento: EstablecimientoEntity = establecimientosList[0];
    const establecimiento: EstablecimientoEntity = await service.findOne(storedEstablecimiento.id);
    expect(establecimiento).not.toBeNull();
    expect(establecimiento.nombre).toEqual(storedEstablecimiento.nombre);
    expect(establecimiento.direccion).toEqual(storedEstablecimiento.direccion);
    expect(establecimiento.capacidad).toEqual(storedEstablecimiento.capacidad);
    expect(establecimiento.costoPromedio).toEqual(storedEstablecimiento.costoPromedio);
    expect(establecimiento.image).toEqual(storedEstablecimiento.image);
    expect(establecimiento.calificacionPromedio).toEqual(storedEstablecimiento.calificacionPromedio);
  });

  it('findOne should throw an exception for an invalid establecimiento', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: 0")
  });
  
  it('create should create a new establecimiento', async () => {
    
    
    const newEstablecimiento: EstablecimientoEntity = await service.create({
      id: '',
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      promociones: [],
      resenias: [],
      menus: [],
      reservas: [],
      adminEst: adminEsta,
      clientes: [],
      tagsEstablecimiento: [],
    },adminEsta.id);
    expect(newEstablecimiento).not.toBeNull();
    expect(newEstablecimiento.nombre).not.toBeNull();
    expect(newEstablecimiento.direccion).not.toBeNull();
    expect(newEstablecimiento.capacidad).not.toBeNull();
    expect(newEstablecimiento.costoPromedio).not.toBeNull();
    expect(newEstablecimiento.image).not.toBeNull();
    expect(newEstablecimiento.calificacionPromedio).not.toBeNull();
  });
  
    it('create should throw an exception for an invalid Admin', async () => {      
      const newEstablecimiento: EstablecimientoEntity = {
        id: '',
        nombre: faker.name.firstName(),
        direccion: faker.address.streetAddress(),
        capacidad: +faker.random.numeric(),
        costoPromedio: +faker.random.numeric(),
        calificacionPromedio: +faker.random.numeric(),
        image: faker.image.imageUrl(),
        promociones: [],
        resenias: [],
        menus: [],
        reservas: [],
        adminEst: null,
        clientes: [],
        tagsEstablecimiento: [],
      };
      await expect(() => service.create(newEstablecimiento,"0")).rejects.toHaveProperty("message", "No existe el adminEsta con el establecimientoId:");
    });

  it('update should modify a establecimiento', async () => {
    const establecimiento: EstablecimientoEntity = establecimientosList[0];
    establecimiento.direccion = 'New name';
    establecimiento.calificacionPromedio = 0;
    const updatedEstablecimiento: EstablecimientoEntity = await service.update(
      establecimiento.id,
      establecimiento,
    );
    expect(updatedEstablecimiento).not.toBeNull();
    const storedEstablecimiento: EstablecimientoEntity =
      await repository.findOne({ where: { id: establecimiento.id } });
    expect(storedEstablecimiento).not.toBeNull();
    expect(storedEstablecimiento.direccion).toEqual(establecimiento.direccion);
    expect(storedEstablecimiento.calificacionPromedio).toEqual(
      establecimiento.calificacionPromedio,
    );
  });

  it('update should throw an exception for an invalid establecimiento', async () => {
    let establecimiento: EstablecimientoEntity = establecimientosList[0];
    establecimiento = {
      ...establecimiento,direccion: 'New name',calificacionPromedio: 0,
    };
    await expect(() => service.update('0', establecimiento)).rejects.toHaveProperty('message','Establecimiento no encontrado');
  });

  it('delete should delete a establecimiento', async () => {
    const establecimiento: EstablecimientoEntity = establecimientosList[0];
    await service.delete(establecimiento.id);
    const deletedEstablecimiento: EstablecimientoEntity = await repository.findOne({ where: { id: establecimiento.id } });
    expect(deletedEstablecimiento).toBeNull();
  });

  it('delete should throw an exception for an invalid establecimiento', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty('message','Establecimiento no encontrado');
  });
});
