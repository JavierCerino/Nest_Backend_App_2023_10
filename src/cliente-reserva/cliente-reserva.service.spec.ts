/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ReservaEntity } from '../reserva/reserva.entity';
import { Repository } from 'typeorm';
import { ClienteEntity } from '../cliente/cliente.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClienteReservaService } from './cliente-reserva.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClienteReservaService', () => {
  let service: ClienteReservaService;
  let clienteRepository: Repository<ClienteEntity>;
  let reservaRepository: Repository<ReservaEntity>;
  let cliente: ClienteEntity;
  let reservasList : ReservaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClienteReservaService],
    }).compile();

    service = module.get<ClienteReservaService>(ClienteReservaService);
    clienteRepository = module.get<Repository<ClienteEntity>>(getRepositoryToken(ClienteEntity));
    reservaRepository = module.get<Repository<ReservaEntity>>(getRepositoryToken(ReservaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    reservaRepository.clear();
    clienteRepository.clear();

    reservasList = [];
    for(let i = 0; i < 5; i++){
        const reserva: ReservaEntity = await reservaRepository.save({
          fecha: faker.date.past(),
          mesaAsignada: faker.datatype.number(),
          numPersonas: faker.datatype.number(),
          tipo: faker.lorem.sentence(),
          descripcion: faker.lorem.sentence()
        })
        reservasList.push(reserva);
    }

    cliente = await clienteRepository.save({
      usuario: faker.internet.userName(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: Number(faker.random.numeric(6)),
      saldo: Number(faker.random.numeric(6)),
      reservasAsignadas: reservasList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addReservaCliente should add an reserva to a cliente', async () => {
    const newReserva: ReservaEntity = await reservaRepository.save({
      fecha: faker.date.past(),
      mesaAsignada: faker.datatype.number(),
      numPersonas: faker.datatype.number(),
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    const newCliente: ClienteEntity = await clienteRepository.save({
      usuario: faker.internet.userName(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: Number(faker.random.numeric(6)),
      saldo: Number(faker.random.numeric(6))
    })
    const result: ClienteEntity = await service.addReservaCliente(newCliente.id, newReserva.id);
    
    expect(result.reservasAsignadas.length).toBe(1);
    expect(result.reservasAsignadas[0]).not.toBeNull();
    expect(result.reservasAsignadas[0].fecha).toStrictEqual(newReserva.fecha)
    expect(result.reservasAsignadas[0].mesaAsignada).toBe(newReserva.mesaAsignada)
    expect(result.reservasAsignadas[0].numPersonas).toBe(newReserva.numPersonas)
    expect(result.reservasAsignadas[0].tipo).toBe(newReserva.tipo)
    expect(result.reservasAsignadas[0].descripcion).toBe(newReserva.descripcion)
  });

  it('addReservaCliente should throw an exception for an invalid cliente', async () => {
    const newReserva: ReservaEntity = await reservaRepository.save({
      fecha: faker.date.past(),
      mesaAsignada: faker.datatype.number(),
      numPersonas: faker.datatype.number(),
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    await expect(() => service.addReservaCliente("0", newReserva.id)).rejects.toHaveProperty("message", "The cliente with the given id was not found");
  });

  it('findReservaByClienteIdReservaId should return reserva by cliente', async () => {
    const reserva: ReservaEntity = reservasList[0];
    const storedReserva: ReservaEntity = await service.findReservaByClienteIdReservaId(cliente.id, reserva.id, )
    expect(storedReserva).not.toBeNull();
    expect(storedReserva.fecha).toStrictEqual(reserva.fecha)
    expect(storedReserva.mesaAsignada).toBe(reserva.mesaAsignada)
    expect(storedReserva.numPersonas).toBe(reserva.numPersonas)
    expect(storedReserva.tipo).toBe(reserva.tipo)
    expect(storedReserva.descripcion).toBe(reserva.descripcion)
  });

  it('findReservaByClienteIdReservaId should throw an exception for an invalid reserva', async () => {
    await expect(()=> service.findReservaByClienteIdReservaId(cliente.id, "0")).rejects.toHaveProperty("message", "The reserva with the given id was not found"); 
  });

  it('findReservaByMuseumIdReservaId should throw an exception for an invalid cliente', async () => {
    const reserva: ReservaEntity = reservasList[0]; 
    await expect(()=> service.findReservaByClienteIdReservaId("0", reserva.id)).rejects.toHaveProperty("message", "The cliente with the given id was not found"); 
  });

  it('findReservaByClienteIdReservaId should throw an exception for an reserva not associated to the cliente', async () => {
    const newReserva: ReservaEntity = await reservaRepository.save({
      fecha: faker.date.past(),
      mesaAsignada: faker.datatype.number(),
      numPersonas: faker.datatype.number(),
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    await expect(()=> service.findReservaByClienteIdReservaId(cliente.id, newReserva.id)).rejects.toHaveProperty("message", "The reserva with the given id is not associated to the cliente"); 
  });

  it('findReservasByClienteId should return reservas by cliente', async ()=>{
    const reservas: ReservaEntity[] = await service.findReservasByClienteId(cliente.id);
    expect(reservas.length).toBe(5)
  });

  it('findReservasByClienteId should throw an exception for an invalid cliente', async () => {
    await expect(()=> service.findReservasByClienteId("0")).rejects.toHaveProperty("message", "The cliente with the given id was not found"); 
  });

  it('associateReservasCliente should update reservas list for a cliente', async () => {
    const newReserva: ReservaEntity = await reservaRepository.save({
      fecha: faker.date.past(),
      mesaAsignada: faker.datatype.number(),
      numPersonas: faker.datatype.number(),
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    const updatedCliente: ClienteEntity = await service.associateReservasCliente(cliente.id, [newReserva]);
    expect(updatedCliente.reservasAsignadas.length).toBe(1);

    expect(updatedCliente.reservasAsignadas[0].fecha).toStrictEqual(newReserva.fecha);
    expect(updatedCliente.reservasAsignadas[0].mesaAsignada).toBe(newReserva.mesaAsignada);
    expect(updatedCliente.reservasAsignadas[0].numPersonas).toBe(newReserva.numPersonas);
    expect(updatedCliente.reservasAsignadas[0].tipo).toBe(newReserva.tipo);
    expect(updatedCliente.reservasAsignadas[0].descripcion).toBe(newReserva.descripcion);
  });

  it('associateReservasCliente should throw an exception for an invalid cliente', async () => {
    const newReserva: ReservaEntity = await reservaRepository.save({
      fecha: faker.date.past(),
      mesaAsignada: faker.datatype.number(),
      numPersonas: faker.datatype.number(),
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    await expect(()=> service.associateReservasCliente("0", [newReserva])).rejects.toHaveProperty("message", "The cliente with the given id was not found"); 
  });

  it('associateReservasCliente should throw an exception for an invalid reserva', async () => {
    const newReserva: ReservaEntity = reservasList[0];
    newReserva.id = "0";

    await expect(()=> service.associateReservasCliente(cliente.id, [newReserva])).rejects.toHaveProperty("message", "The reserva with the given id was not found"); 
  });

  it('deleteReservaToCliente should remove an reserva from a cliente', async () => {
    const reserva: ReservaEntity = reservasList[0];
    
    await service.deleteReservaCliente(cliente.id, reserva.id);

    const storedCliente: ClienteEntity = await clienteRepository.findOne({where: {id: cliente.id}, relations: ["reservasAsignadas"]});
    const deletedReserva: ReservaEntity = storedCliente.reservasAsignadas.find(a => a.id === reserva.id);

    expect(deletedReserva).toBeUndefined();

  });

  it('deleteReservaToCliente should thrown an exception for an invalid reserva', async () => {
    await expect(()=> service.deleteReservaCliente(cliente.id, "0")).rejects.toHaveProperty("message", "The reserva with the given id was not found"); 
  });

  it('deleteReservaToCliente should thrown an exception for an invalid cliente', async () => {
    const reserva: ReservaEntity = reservasList[0];
    await expect(()=> service.deleteReservaCliente("0", reserva.id)).rejects.toHaveProperty("message", "The cliente with the given id was not found"); 
  });

  it('deleteReservaToCliente should thrown an exception for an non asocciated reserva', async () => {
    const newReserva: ReservaEntity = await reservaRepository.save({
      fecha: faker.date.past(),
      mesaAsignada: faker.datatype.number(),
      numPersonas: faker.datatype.number(),
      tipo: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence()
    });

    await expect(()=> service.deleteReservaCliente(cliente.id, newReserva.id)).rejects.toHaveProperty("message", "The reserva with the given id is not associated to the cliente"); 
  }); 

});
