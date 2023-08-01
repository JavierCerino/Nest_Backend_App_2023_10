/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { ReseniaEntity } from '../resenia/resenia.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EstablecimientoReseniaService } from './establecimiento-resenia.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { AdministradorEstablecimientoEntity } from '../administrador_establecimiento/administrador_establecimiento.entity';

describe('EstablecimientoReseniaService', () => {
  let service: EstablecimientoReseniaService;
  let establecimientoRepository: Repository<EstablecimientoEntity>;
  let reseniaRepository: Repository<ReseniaEntity>;
  let establecimiento: EstablecimientoEntity;
  let reseniasList : ReseniaEntity[];
  let repositotyAdmin: Repository<AdministradorEstablecimientoEntity>;
  let adminEsta: AdministradorEstablecimientoEntity;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstablecimientoReseniaService],
    }).compile();

    service = module.get<EstablecimientoReseniaService>(EstablecimientoReseniaService);
    establecimientoRepository = module.get<Repository<EstablecimientoEntity>>(getRepositoryToken(EstablecimientoEntity));
    reseniaRepository = module.get<Repository<ReseniaEntity>>(getRepositoryToken(ReseniaEntity));
    repositotyAdmin = module.get<Repository<AdministradorEstablecimientoEntity>>(getRepositoryToken(AdministradorEstablecimientoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    reseniaRepository.clear();
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
    reseniasList = [];
    for(let i = 0; i < 5; i++){
        const resenia: ReseniaEntity = await reseniaRepository.save({
          tipo: faker.lorem.sentence(),
          descripcion: faker.lorem.sentence()
        });
        reseniasList.push(resenia);
    }

    establecimiento = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      resenias: reseniasList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addReseniaEstablecimiento should add a resenia to an establecimiento', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });
      const resenias: ReseniaEntity[] = [];
      resenias.push(newResenia);

    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      resenias: resenias
    })

    const result: EstablecimientoEntity = await service.addReseniaEstablecimiento(newEstablecimiento.id, newResenia.id);
    
    expect(result.resenias.length).toBe(2);
    expect(result.resenias[0].tipo).toBe(newResenia.tipo);
    expect(result.resenias[0].descripcion).toBe(newResenia.descripcion);
  });

  it('addReseniaEstablecimiento should thrown exception for an invalid resenia', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      resenias: reseniasList
    })

    await expect(() => service.addReseniaEstablecimiento(newEstablecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el resenia con el reseniaId: ");
  });

  it('addReseniaEstablecimiento should throw an exception for an invalid establecimiento', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    await expect(() => service.addReseniaEstablecimiento("0", newResenia.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: ");
  });

  it('findReseniaByEstablecimientoIdReseniaId should return resenia by establecimiento', async () => {
    const resenia: ReseniaEntity = reseniasList[0];
    const storedResenia: ReseniaEntity = await service.findReseniaByEstablecimientoIdReseniaId(establecimiento.id, resenia.id, )
    expect(storedResenia).not.toBeNull();
    expect(storedResenia.tipo).toBe(resenia.tipo);
    expect(storedResenia.descripcion).toBe(resenia.descripcion);
  });

  it('findReseniaByEstablecimientoIdReseniaId should throw an exception for an invalid resenia', async () => {
    await expect(()=> service.findReseniaByEstablecimientoIdReseniaId(establecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el resenia con el reseniaId: "); 
  });

  it('findReseniaByEstablecimientoIdReseniaId should throw an exception for an invalid establecimiento', async () => {
    const resenia: ReseniaEntity = reseniasList[0]; 
    await expect(()=> service.findReseniaByEstablecimientoIdReseniaId("0", resenia.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('findReseniaByEstablecimientoIdReseniaId should throw an exception for a resenia not associated to the establecimiento', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    await expect(()=> service.findReseniaByEstablecimientoIdReseniaId(establecimiento.id, newResenia.id)).rejects.toHaveProperty("message", "El  resenia con el id dado no esta asociado con el establecimiento"); 
  });

  it('findReseniasByEstablecimientoId should return resenias by establecimiento', async ()=>{
    const resenias: ReseniaEntity[] = await service.findReseniasByEstablecimientoId(establecimiento.id);
    expect(resenias.length).toBe(5)
  });

  it('findReseniasByEstablecimientoId should throw an exception for an invalid establecimiento', async () => {
    await expect(()=> service.findReseniasByEstablecimientoId("0")).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('associateReseniasEstablecimiento should update resenias list for an establecimiento', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    const updatedEstablecimiento: EstablecimientoEntity = await service.associateReseniasEstablecimiento(establecimiento.id, [newResenia]);
    expect(updatedEstablecimiento.resenias.length).toBe(1);

    expect(updatedEstablecimiento.resenias[0].tipo).toBe(newResenia.tipo);
    expect(updatedEstablecimiento.resenias[0].descripcion).toBe(newResenia.descripcion);
  });

  it('associateReseniasEstablecimiento should throw an exception for an invalid establecimiento', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    await expect(()=> service.associateReseniasEstablecimiento("0", [newResenia])).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('associateReseniasEstablecimiento should throw an exception for an invalid resenia', async () => {
    const newResenia: ReseniaEntity = reseniasList[0];
    newResenia.id = "0";

    await expect(()=> service.associateReseniasEstablecimiento(establecimiento.id, [newResenia])).rejects.toHaveProperty("message", "No existe el resenia con el reseniaId: "); 
  });

  it('deleteReseniaToEstablecimiento should remove a resenia from an establecimiento', async () => {
    const resenia: ReseniaEntity = reseniasList[0];
    
    await service.deleteReseniaEstablecimiento(establecimiento.id, resenia.id);

    const storedEstablecimiento: EstablecimientoEntity = await establecimientoRepository.findOne({where: {id: establecimiento.id}, relations: ["resenias"]});
    const deletedResenia: ReseniaEntity = storedEstablecimiento.resenias.find(a => a.id === resenia.id);

    expect(deletedResenia).toBeUndefined();

  });

  it('deleteReseniaToEstablecimiento should thrown an exception for an invalid resenia', async () => {
    await expect(()=> service.deleteReseniaEstablecimiento(establecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el resenia con el reseniaId: "); 
  });

  it('deleteReseniaToEstablecimiento should thrown an exception for an invalid establecimiento', async () => {
    const resenia: ReseniaEntity = reseniasList[0];
    await expect(()=> service.deleteReseniaEstablecimiento("0", resenia.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('deleteReseniaToEstablecimiento should thrown an exception for an non asocciated resenia', async () => {
    const newResenia: ReseniaEntity = await reseniaRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    await expect(()=> service.deleteReseniaEstablecimiento(establecimiento.id, newResenia.id)).rejects.toHaveProperty("message", "El  resenia con el id dado no esta asociado con el establecimiento"); 
  }); 

});