/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { PromocionEntity } from '../promocion/promocion.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EstablecimientoPromocionService } from './establecimiento-promocion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { AdministradorEstablecimientoEntity } from '../administrador_establecimiento/administrador_establecimiento.entity';

describe('EstablecimientoPromocionService', () => {
  let service: EstablecimientoPromocionService;
  let establecimientoRepository: Repository<EstablecimientoEntity>;
  let promocionRepository: Repository<PromocionEntity>;
  let establecimiento: EstablecimientoEntity;
  let promocionesList : PromocionEntity[];
  let repositotyAdmin: Repository<AdministradorEstablecimientoEntity>;
  let adminEsta: AdministradorEstablecimientoEntity;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstablecimientoPromocionService],
    }).compile();

    service = module.get<EstablecimientoPromocionService>(EstablecimientoPromocionService);
    establecimientoRepository = module.get<Repository<EstablecimientoEntity>>(getRepositoryToken(EstablecimientoEntity));
    promocionRepository = module.get<Repository<PromocionEntity>>(getRepositoryToken(PromocionEntity));
    repositotyAdmin = module.get<Repository<AdministradorEstablecimientoEntity>>(getRepositoryToken(AdministradorEstablecimientoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    promocionRepository.clear();
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
    promocionesList = [];
    for(let i = 0; i < 5; i++){
        const promocion: PromocionEntity = await promocionRepository.save({
          tipo: faker.lorem.sentence(),
          descripcion: faker.lorem.sentence()
        });
        promocionesList.push(promocion);
    }

    establecimiento = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      promociones: promocionesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPromocionEstablecimiento should add a promocion to an establecimiento', async () => {
    const newPromocion: PromocionEntity = await promocionRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });
      const promociones: PromocionEntity[] = [];
      promociones.push(newPromocion);

    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      promociones: promociones
    })

    const result: EstablecimientoEntity = await service.addPromocionEstablecimiento(newEstablecimiento.id, newPromocion.id);
    
    expect(result.promociones.length).toBe(2);
    expect(result.promociones[0].tipo).toBe(newPromocion.tipo);
    expect(result.promociones[0].descripcion).toBe(newPromocion.descripcion);
  });

  it('addPromocionEstablecimiento should thrown exception for an invalid promocion', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      promociones: promocionesList
    })

    await expect(() => service.addPromocionEstablecimiento(newEstablecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el promocion con el promocionId: ");
  });

  it('addPromocionEstablecimiento should throw an exception for an invalid establecimiento', async () => {
    const newPromocion: PromocionEntity = await promocionRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    await expect(() => service.addPromocionEstablecimiento("0", newPromocion.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: ");
  });

  it('findPromocionByEstablecimientoIdPromocionId should return promocion by establecimiento', async () => {
    const promocion: PromocionEntity = promocionesList[0];
    const storedPromocion: PromocionEntity = await service.findPromocionByEstablecimientoIdPromocionId(establecimiento.id, promocion.id, )
    expect(storedPromocion).not.toBeNull();
    expect(storedPromocion.tipo).toBe(promocion.tipo);
    expect(storedPromocion.descripcion).toBe(promocion.descripcion);
  });

  it('findPromocionByEstablecimientoIdPromocionId should throw an exception for an invalid promocion', async () => {
    await expect(()=> service.findPromocionByEstablecimientoIdPromocionId(establecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el promocion con el promocionId: "); 
  });

  it('findPromocionByEstablecimientoIdPromocionId should throw an exception for an invalid establecimiento', async () => {
    const promocion: PromocionEntity = promocionesList[0]; 
    await expect(()=> service.findPromocionByEstablecimientoIdPromocionId("0", promocion.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('findPromocionByEstablecimientoIdPromocionId should throw an exception for a promocion not associated to the establecimiento', async () => {
    const newPromocion: PromocionEntity = await promocionRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    await expect(()=> service.findPromocionByEstablecimientoIdPromocionId(establecimiento.id, newPromocion.id)).rejects.toHaveProperty("message", "El  promocion con el id dado no esta asociado con el establecimiento"); 
  });

  it('findPromocionsByEstablecimientoId should return promociones by establecimiento', async ()=>{
    const promociones: PromocionEntity[] = await service.findPromocionsByEstablecimientoId(establecimiento.id);
    expect(promociones.length).toBe(5)
  });

  it('findPromocionsByEstablecimientoId should throw an exception for an invalid establecimiento', async () => {
    await expect(()=> service.findPromocionsByEstablecimientoId("0")).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('associatePromocionsEstablecimiento should update promociones list for an establecimiento', async () => {
    const newPromocion: PromocionEntity = await promocionRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    const updatedEstablecimiento: EstablecimientoEntity = await service.associatePromocionsEstablecimiento(establecimiento.id, [newPromocion]);
    expect(updatedEstablecimiento.promociones.length).toBe(1);

    expect(updatedEstablecimiento.promociones[0].tipo).toBe(newPromocion.tipo);
    expect(updatedEstablecimiento.promociones[0].descripcion).toBe(newPromocion.descripcion);
  });

  it('associatePromocionsEstablecimiento should throw an exception for an invalid establecimiento', async () => {
    const newPromocion: PromocionEntity = await promocionRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    await expect(()=> service.associatePromocionsEstablecimiento("0", [newPromocion])).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('associatePromocionsEstablecimiento should throw an exception for an invalid promocion', async () => {
    const newPromocion: PromocionEntity = promocionesList[0];
    newPromocion.id = "0";

    await expect(()=> service.associatePromocionsEstablecimiento(establecimiento.id, [newPromocion])).rejects.toHaveProperty("message", "No existe el promocion con el promocionId: "); 
  });

  it('deletePromocionToEstablecimiento should remove a promocion from an establecimiento', async () => {
    const promocion: PromocionEntity = promocionesList[0];
    
    await service.deletePromocionEstablecimiento(establecimiento.id, promocion.id);

    const storedEstablecimiento: EstablecimientoEntity = await establecimientoRepository.findOne({where: {id: establecimiento.id}, relations: ["promociones"]});
    const deletedPromocion: PromocionEntity = storedEstablecimiento.promociones.find(a => a.id === promocion.id);

    expect(deletedPromocion).toBeUndefined();

  });

  it('deletePromocionToEstablecimiento should thrown an exception for an invalid promocion', async () => {
    await expect(()=> service.deletePromocionEstablecimiento(establecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el promocion con el promocionId: "); 
  });

  it('deletePromocionToEstablecimiento should thrown an exception for an invalid establecimiento', async () => {
    const promocion: PromocionEntity = promocionesList[0];
    await expect(()=> service.deletePromocionEstablecimiento("0", promocion.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('deletePromocionToEstablecimiento should thrown an exception for an non asocciated promocion', async () => {
    const newPromocion: PromocionEntity = await promocionRepository.save({
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    await expect(()=> service.deletePromocionEstablecimiento(establecimiento.id, newPromocion.id)).rejects.toHaveProperty("message", "El  promocion con el id dado no esta asociado con el establecimiento"); 
  }); 

});