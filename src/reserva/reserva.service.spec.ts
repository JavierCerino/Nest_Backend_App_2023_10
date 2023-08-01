import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ReservaEntity } from './reserva.entity';
import { ReservaService } from './reserva.service';
import { faker } from '@faker-js/faker';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';

describe('ReservaService', () => {
  let service: ReservaService;
  let repository: Repository<ReservaEntity>;
  let establecimientoRepository: Repository<EstablecimientoEntity>;
  let reservaList: ReservaEntity[];
  let establecimiento: EstablecimientoEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservaService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<ReservaService>(ReservaService);
    repository = module.get<Repository<ReservaEntity>>(getRepositoryToken(ReservaEntity));
    establecimientoRepository = module.get<Repository<EstablecimientoEntity>>(getRepositoryToken(EstablecimientoEntity));
    await seedDatabase();
  });

  // Funcion para seeding
  const seedDatabase = async () => {
    repository.clear();
    establecimientoRepository.clear();
    reservaList = [];
    for (let i = 0; i < 5; i++) {
      const reserva: ReservaEntity = await repository.save({
        fecha: faker.date.past(),
        mesaAsignada: faker.datatype.number(),
        numPersonas: faker.datatype.number(),
        tipo: faker.lorem.sentence(),
        descripcion: faker.lorem.sentence(),
        clientes: [],
        productos: [],
        establecimiento: undefined
      })
      reservaList.push(reserva);
    }
    establecimiento = await establecimientoRepository.save({
      nombre: faker.lorem.sentence(),
      direccion: faker.lorem.sentence(),
      capacidad: faker.datatype.number(),
      costoPromedio: faker.datatype.number(),
      calificacionPromedio: faker.datatype.number(),
      image: faker.image.imageUrl(),
      reservas: []
    });

  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all reservas', async () => {
    const reservas: ReservaEntity[] = await service.findAll();
    expect(reservas).not.toBeNull();
    expect(reservas).toHaveLength(reservaList.length);
  });

  it('findOne should return a reserva by id', async () => {
    const storedReserva: ReservaEntity = reservaList[0];
    const reserva: ReservaEntity = await service.findOne(storedReserva.id);
    expect(reserva).not.toBeNull();
    expect(reserva.tipo).toEqual(storedReserva.tipo)
    expect(reserva.descripcion).toEqual(storedReserva.descripcion)
    expect(reserva.fecha).toEqual(storedReserva.fecha)
    expect(reserva.mesaAsignada).toEqual(storedReserva.mesaAsignada)
    expect(reserva.numPersonas).toEqual(storedReserva.numPersonas)
  });

  it('findOne should throw an exception for an invalid reserva', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The reserva with the given id was not found")
  });

  it('create should return a new reserva', async () => {
    // Se debe validar la creación con un establecimiento valido
    const reserva: ReservaEntity = {
      id: faker.datatype.uuid(),
      fecha: faker.date.past(),
      mesaAsignada: faker.datatype.number(),
      numPersonas: faker.datatype.number(),
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      clientes: [],
      productos: [],
      establecimiento: undefined
    }
    const createdReserva: ReservaEntity = await service.create(reserva, establecimiento.id);
    expect(createdReserva).not.toBeNull();
    const storedReserva: ReservaEntity = await repository.findOne({ where: { id: createdReserva.id } })
    expect(storedReserva).not.toBeNull();
    expect(storedReserva.descripcion).toEqual(reserva.descripcion)
    expect(storedReserva.tipo).toEqual(reserva.tipo)
  });

  it('create should throw an exception for an invalid establecimiento', async () => {
    const reserva: ReservaEntity = {
      id: faker.datatype.uuid(),
      fecha: faker.date.past(),
      mesaAsignada: faker.datatype.number(),
      numPersonas: faker.datatype.number(),
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      clientes: [],
      productos: [],
      establecimiento: undefined  
    }
    await expect(() => service.create(reserva, "0")).rejects.toHaveProperty("message", "The establecimiento with the given id was not found")
  });

  it('update should modify a reserva', async () => {
    const reserva: ReservaEntity = reservaList[0];
    reserva.fecha = faker.date.past();
    reserva.mesaAsignada = faker.datatype.number();
    reserva.numPersonas = faker.datatype.number();
    reserva.tipo = faker.lorem.sentence();
    reserva.descripcion = faker.lorem.sentence();
    reserva.clientes = [];
    reserva.productos = [];
    reserva.establecimiento = establecimiento;
    const updatedReserva: ReservaEntity = await service.update(reserva.id, reserva);
    expect(updatedReserva).not.toBeNull();
    const storedReserva: ReservaEntity = await repository.findOne({ where: { id: reserva.id } })
    expect(storedReserva).not.toBeNull();
    expect(storedReserva.descripcion).toEqual(reserva.descripcion)
    expect(storedReserva.tipo).toEqual(reserva.tipo)
  });

  it('update should throw an exception for an invalid reserva', async () => {
    let reserva: ReservaEntity = reservaList[0];
    reserva = {
      ...reserva, descripcion: "New descripcion", tipo: "New tipo", fecha: faker.date.past(), mesaAsignada: faker.datatype.number(), numPersonas: faker.datatype.number(), clientes: [], productos: [], establecimiento: undefined
    }
    await expect(() => service.update("0", reserva)).rejects.toHaveProperty("message", "The reserva with the given id was not found")
  });

  it('delete should delete a reserva', async () => {
    const reserva: ReservaEntity = reservaList[0];
    await service.delete(reserva.id);
    const storedReserva: ReservaEntity = await repository.findOne({ where: { id: reserva.id } })
    expect(storedReserva).toBeNull();
  });

  it('delete should throw an exception for an invalid reserva', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The reserva with the given id was not found")
  });

});
