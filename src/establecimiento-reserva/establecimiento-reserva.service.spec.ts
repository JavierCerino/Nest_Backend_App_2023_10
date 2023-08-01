/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { ReservaEntity } from '../reserva/reserva.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EstablecimientoReservaService } from './establecimiento-reserva.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { AdministradorEstablecimientoEntity } from '../administrador_establecimiento/administrador_establecimiento.entity';

describe('EstablecimientoReservaService', () => {
  let service: EstablecimientoReservaService;
  let establecimientoRepository: Repository<EstablecimientoEntity>;
  let reservaRepository: Repository<ReservaEntity>;
  let establecimiento: EstablecimientoEntity;
  let reservasList : ReservaEntity[];
  let repositotyAdmin: Repository<AdministradorEstablecimientoEntity>;
  let adminEsta: AdministradorEstablecimientoEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstablecimientoReservaService],
    }).compile();

    service = module.get<EstablecimientoReservaService>(EstablecimientoReservaService);
    establecimientoRepository = module.get<Repository<EstablecimientoEntity>>(getRepositoryToken(EstablecimientoEntity));
    reservaRepository = module.get<Repository<ReservaEntity>>(getRepositoryToken(ReservaEntity));
    repositotyAdmin = module.get<Repository<AdministradorEstablecimientoEntity>>(getRepositoryToken(AdministradorEstablecimientoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    reservaRepository.clear();
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
    reservasList = [];
    for(let i = 0; i < 5; i++){
        const reserva: ReservaEntity = await reservaRepository.save({
          fecha: faker.date.future(),
          mesaAsignada: parseInt(faker.random.numeric()),
          numPersonas: parseInt(faker.random.numeric()),
          tipo: faker.commerce.productName(),
          descripcion: faker.lorem.sentence(),
        });
        reservasList.push(reserva);
    }

    establecimiento = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      reservas: reservasList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addReservaEstablecimiento should add a reserva to an establecimiento', async () => {
    const newReserva: ReservaEntity = await reservaRepository.save({
      fecha: faker.date.future(),
      mesaAsignada: parseInt(faker.random.numeric()),
      numPersonas: parseInt(faker.random.numeric()),
      tipo: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
    });
      const reservas: ReservaEntity[] = [];
      reservas.push(newReserva);

    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      reservas: reservas
    })

    const result: EstablecimientoEntity = await service.addReservaEstablecimiento(newEstablecimiento.id, newReserva.id);
    
    expect(result.reservas.length).toBe(2);
    expect(result.reservas[0].fecha).toStrictEqual(newReserva.fecha);
    expect(result.reservas[0].descripcion).toBe(newReserva.descripcion);
    expect(result.reservas[0].mesaAsignada).toBe(newReserva.mesaAsignada);
    expect(result.reservas[0].numPersonas).toBe(newReserva.numPersonas);
    expect(result.reservas[0].tipo).toBe(newReserva.tipo);
  });

  it('addReservaEstablecimiento should thrown exception for an invalid reserva', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      reservas: reservasList
    })

    await expect(() => service.addReservaEstablecimiento(newEstablecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el reserva con el reservaId: ");
  });

  it('addReservaEstablecimiento should throw an exception for an invalid establecimiento', async () => {
    const newReserva: ReservaEntity = await reservaRepository.save({
      fecha: faker.date.future(),
      mesaAsignada: parseInt(faker.random.numeric()),
      numPersonas: parseInt(faker.random.numeric()),
      tipo: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
    });

    await expect(() => service.addReservaEstablecimiento("0", newReserva.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: ");
  });

  it('findReservaByEstablecimientoIdReservaId should return reserva by establecimiento', async () => {
    const reserva: ReservaEntity = reservasList[0];
    const storedReserva: ReservaEntity = await service.findReservaByEstablecimientoIdReservaId(establecimiento.id, reserva.id, )
    expect(storedReserva).not.toBeNull();
    expect(storedReserva.fecha).toStrictEqual(reserva.fecha);
    expect(storedReserva.descripcion).toBe(reserva.descripcion);
    expect(storedReserva.mesaAsignada).toBe(reserva.mesaAsignada);
    expect(storedReserva.tipo).toBe(reserva.tipo);
    expect(storedReserva.numPersonas).toBe(reserva.numPersonas);
  });

  it('findReservaByEstablecimientoIdReservaId should throw an exception for an invalid reserva', async () => {
    await expect(()=> service.findReservaByEstablecimientoIdReservaId(establecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el reserva con el reservaId: "); 
  });

  it('findReservaByEstablecimientoIdReservaId should throw an exception for an invalid establecimiento', async () => {
    const reserva: ReservaEntity = reservasList[0]; 
    await expect(()=> service.findReservaByEstablecimientoIdReservaId("0", reserva.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('findReservaByEstablecimientoIdReservaId should throw an exception for a reserva not associated to the establecimiento', async () => {
    const newReserva: ReservaEntity = await reservaRepository.save({
      fecha: faker.date.future(),
      mesaAsignada: parseInt(faker.random.numeric()),
      numPersonas: parseInt(faker.random.numeric()),
      tipo: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
    });

    await expect(()=> service.findReservaByEstablecimientoIdReservaId(establecimiento.id, newReserva.id)).rejects.toHaveProperty("message", "El  reserva con el id dado no esta asociado con el establecimiento"); 
  });

  it('findReservasByEstablecimientoId should return reservas by establecimiento', async ()=>{
    const reservas: ReservaEntity[] = await service.findReservasByEstablecimientoId(establecimiento.id);
    expect(reservas.length).toBe(5)
  });

  it('findReservasByEstablecimientoId should throw an exception for an invalid establecimiento', async () => {
    await expect(()=> service.findReservasByEstablecimientoId("0")).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('associateReservasEstablecimiento should update reservas list for an establecimiento', async () => {
    const newReserva: ReservaEntity = await reservaRepository.save({
      fecha: faker.date.future(),
      mesaAsignada: parseInt(faker.random.numeric()),
      numPersonas: parseInt(faker.random.numeric()),
      tipo: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
    });

    const updatedEstablecimiento: EstablecimientoEntity = await service.associateReservasEstablecimiento(establecimiento.id, [newReserva]);
    expect(updatedEstablecimiento.reservas.length).toBe(1);

    expect(updatedEstablecimiento.reservas[0].fecha).toStrictEqual(newReserva.fecha);
    expect(updatedEstablecimiento.reservas[0].mesaAsignada).toBe(newReserva.mesaAsignada);
    expect(updatedEstablecimiento.reservas[0].numPersonas).toBe(newReserva.numPersonas);
    expect(updatedEstablecimiento.reservas[0].tipo).toBe(newReserva.tipo);
    expect(updatedEstablecimiento.reservas[0].descripcion).toBe(newReserva.descripcion);
  });

  it('associateReservasEstablecimiento should throw an exception for an invalid establecimiento', async () => {
    const newReserva: ReservaEntity = await reservaRepository.save({
      fecha: faker.date.future(),
      mesaAsignada: parseInt(faker.random.numeric()),
      numPersonas: parseInt(faker.random.numeric()),
      tipo: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
    });

    await expect(()=> service.associateReservasEstablecimiento("0", [newReserva])).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('associateReservasEstablecimiento should throw an exception for an invalid reserva', async () => {
    const newReserva: ReservaEntity = reservasList[0];
    newReserva.id = "0";

    await expect(()=> service.associateReservasEstablecimiento(establecimiento.id, [newReserva])).rejects.toHaveProperty("message", "No existe el reserva con el reservaId: "); 
  });

  it('deleteReservaToEstablecimiento should remove a reserva from an establecimiento', async () => {
    const reserva: ReservaEntity = reservasList[0];
    
    await service.deleteReservaEstablecimiento(establecimiento.id, reserva.id);

    const storedEstablecimiento: EstablecimientoEntity = await establecimientoRepository.findOne({where: {id: establecimiento.id}, relations: ["reservas"]});
    const deletedReserva: ReservaEntity = storedEstablecimiento.reservas.find(a => a.id === reserva.id);

    expect(deletedReserva).toBeUndefined();

  });

  it('deleteReservaToEstablecimiento should thrown an exception for an invalid reserva', async () => {
    await expect(()=> service.deleteReservaEstablecimiento(establecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el reserva con el reservaId: "); 
  });

  it('deleteReservaToEstablecimiento should thrown an exception for an invalid establecimiento', async () => {
    const reserva: ReservaEntity = reservasList[0];
    await expect(()=> service.deleteReservaEstablecimiento("0", reserva.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('deleteReservaToEstablecimiento should thrown an exception for an non asocciated reserva', async () => {
    const newReserva: ReservaEntity = await reservaRepository.save({
      fecha: faker.date.future(),
      mesaAsignada: parseInt(faker.random.numeric()),
      numPersonas: parseInt(faker.random.numeric()),
      tipo: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
    });

    await expect(()=> service.deleteReservaEstablecimiento(establecimiento.id, newReserva.id)).rejects.toHaveProperty("message", "El  reserva con el id dado no esta asociado con el establecimiento"); 
  }); 

});