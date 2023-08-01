/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ClienteEntity } from '../cliente/cliente.entity';
import { Repository } from 'typeorm';
import { ReservaEntity } from '../reserva/reserva.entity';
import { ReservaClienteService } from './reserva-cliente.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ReservaClienteService', () => {
  let service: ReservaClienteService;
  let reservaRepository: Repository<ReservaEntity>;
  let clienteRepository: Repository<ClienteEntity>;
  let reserva: ReservaEntity;
  let clientesList: ClienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ReservaClienteService],
    }).compile();

    service = module.get<ReservaClienteService>(ReservaClienteService);
    reservaRepository = module.get<Repository<ReservaEntity>>(getRepositoryToken(ReservaEntity));
    clienteRepository = module.get<Repository<ClienteEntity>>(getRepositoryToken(ClienteEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    clienteRepository.clear();
    reservaRepository.clear();

    clientesList = [];
    for (let i = 0; i < 5; i++) {
      const cliente: ClienteEntity = await clienteRepository.save({
        perfilAdquisitivo: faker.datatype.number(),
        saldo: faker.datatype.number(),
        nombre: faker.name.firstName(),
        apellido: faker.name.lastName(),
        usuario: faker.internet.userName(),
        contraseña: faker.internet.password(),
        correo: faker.internet.email(),
        image: faker.image.imageUrl(),
      })
      clientesList.push(cliente);
    }

    reserva = await reservaRepository.save({
      fecha: faker.date.future(),
      mesaAsignada: parseInt(faker.random.numeric()),
      numPersonas: parseInt(faker.random.numeric()),
      tipo: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      clientes: clientesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addClienteReserva should add an cliente to a reserva', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      perfilAdquisitivo: faker.datatype.number(),
      saldo: faker.datatype.number(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
    });

    const newReserva: ReservaEntity = await reservaRepository.save({
      fecha: faker.date.future(),
      mesaAsignada: parseInt(faker.random.numeric()),
      numPersonas: parseInt(faker.random.numeric()),
      tipo: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      clientes: []
    })

    const result: ReservaEntity = await service.addClienteReserva(newReserva.id, newCliente.id);

    expect(result.clientes.length).toBe(1);
    expect(result.clientes[0]).not.toBeNull();
    expect(result.clientes[0].nombre).toBe(newCliente.nombre)
    expect(result.clientes[0].perfilAdquisitivo).toBe(newCliente.perfilAdquisitivo)
    expect(result.clientes[0].saldo).toBe(newCliente.saldo)
    expect(result.clientes[0].apellido).toBe(newCliente.apellido)
    expect(result.clientes[0].usuario).toBe(newCliente.usuario)
    expect(result.clientes[0].contraseña).toBe(newCliente.contraseña)
    expect(result.clientes[0].correo).toBe(newCliente.correo)
    expect(result.clientes[0].image).toBe(newCliente.image)
  });

  it('addClienteReserva should thrown exception for an invalid cliente', async () => {
    const newReserva: ReservaEntity = await reservaRepository.save({
      fecha: faker.date.future(),
      mesaAsignada: parseInt(faker.random.numeric()),
      numPersonas: parseInt(faker.random.numeric()),
      tipo: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      clientes: clientesList
    })

    await expect(() => service.addClienteReserva(newReserva.id, "0")).rejects.toHaveProperty("message", "The cliente with the given id was not found");
  });

  it('addClienteReserva should throw an exception for an invalid reserva', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      perfilAdquisitivo: faker.datatype.number(),
      saldo: faker.datatype.number(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
    });

    await expect(() => service.addClienteReserva("0", newCliente.id)).rejects.toHaveProperty("message", "The reserva with the given id was not found");
  });

  it('findClienteByReservaIdClienteId should return cliente by reserva', async () => {
    const cliente: ClienteEntity = clientesList[0];
    const storedCliente: ClienteEntity = await service.findClienteByReservaIdClienteId(reserva.id, cliente.id,)
    expect(storedCliente).not.toBeNull();
    expect(storedCliente.perfilAdquisitivo).toBe(cliente.perfilAdquisitivo);
    expect(storedCliente.saldo).toBe(cliente.saldo);
    expect(storedCliente.nombre).toBe(cliente.nombre);
    expect(storedCliente.apellido).toBe(cliente.apellido);
    expect(storedCliente.usuario).toBe(cliente.usuario);
    expect(storedCliente.contraseña).toBe(cliente.contraseña);
    expect(storedCliente.correo).toBe(cliente.correo);
    expect(storedCliente.image).toBe(cliente.image);
  });

  it('findClienteByReservaIdClienteId should throw an exception for an invalid cliente', async () => {
    await expect(() => service.findClienteByReservaIdClienteId(reserva.id, "0")).rejects.toHaveProperty("message", "The cliente with the given id was not found");
  });

  it('findClienteByReservaIdClienteId should throw an exception for an invalid reserva', async () => {
    const cliente: ClienteEntity = clientesList[0];
    await expect(() => service.findClienteByReservaIdClienteId("0", cliente.id)).rejects.toHaveProperty("message", "The reserva with the given id was not found");
  });

  it('findClienteByReservaIdClienteId should throw an exception for an cliente not associated to the reserva', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      perfilAdquisitivo: faker.datatype.number(),
      saldo: faker.datatype.number(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
    });

    await expect(() => service.findClienteByReservaIdClienteId(reserva.id, newCliente.id)).rejects.toHaveProperty("message", "The cliente with the given id is not associated to the reserva");
  });

  it('findClientesByReservaId should return clientes by reserva', async () => {
    const clientes: ClienteEntity[] = await service.findClientesByReservaId(reserva.id);
    expect(clientes.length).toBe(5)
  });

  it('findClientesByReservaId should throw an exception for an invalid reserva', async () => {
    await expect(() => service.findClientesByReservaId("0")).rejects.toHaveProperty("message", "The reserva with the given id was not found");
  });

  it('associateClientesReserva should update clientes list for a reserva', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      perfilAdquisitivo: faker.datatype.number(),
      saldo: faker.datatype.number(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
    });

    const updatedReserva: ReservaEntity = await service.associateClientesReserva(reserva.id, [newCliente]);
    expect(updatedReserva.clientes.length).toBe(1);
    expect(updatedReserva.clientes[0].perfilAdquisitivo).toBe(newCliente.perfilAdquisitivo);
    expect(updatedReserva.clientes[0].saldo).toBe(newCliente.saldo);
    expect(updatedReserva.clientes[0].nombre).toBe(newCliente.nombre);
    expect(updatedReserva.clientes[0].apellido).toBe(newCliente.apellido);
    expect(updatedReserva.clientes[0].usuario).toBe(newCliente.usuario);
    expect(updatedReserva.clientes[0].contraseña).toBe(newCliente.contraseña);
    expect(updatedReserva.clientes[0].correo).toBe(newCliente.correo);
    expect(updatedReserva.clientes[0].image).toBe(newCliente.image);
  });

  it('associateClientesReserva should throw an exception for an invalid reserva', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      perfilAdquisitivo: faker.datatype.number(),
      saldo: faker.datatype.number(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
    });

    await expect(() => service.associateClientesReserva("0", [newCliente])).rejects.toHaveProperty("message", "The reserva with the given id was not found");
  });

  it('associateClientesReserva should throw an exception for an invalid cliente', async () => {
    const newCliente: ClienteEntity = clientesList[0];
    newCliente.id = "0";

    await expect(() => service.associateClientesReserva(reserva.id, [newCliente])).rejects.toHaveProperty("message", "The cliente with the given id was not found");
  });

  it('deleteClienteToReserva should remove an cliente from a reserva', async () => {
    const cliente: ClienteEntity = clientesList[0];

    await service.deleteClienteReserva(reserva.id, cliente.id);

    const storedReserva: ReservaEntity = await reservaRepository.findOne({ where: { id: reserva.id }, relations: ["clientes"] });
    const deletedCliente: ClienteEntity = storedReserva.clientes.find(a => a.id === cliente.id);

    expect(deletedCliente).toBeUndefined();

  });

  it('deleteClienteToReserva should thrown an exception for an invalid cliente', async () => {
    await expect(() => service.deleteClienteReserva(reserva.id, "0")).rejects.toHaveProperty("message", "The cliente with the given id was not found");
  });

  it('deleteClienteToReserva should thrown an exception for an invalid reserva', async () => {
    const cliente: ClienteEntity = clientesList[0];
    await expect(() => service.deleteClienteReserva("0", cliente.id)).rejects.toHaveProperty("message", "The reserva with the given id was not found");
  });

  it('deleteClienteToReserva should thrown an exception for an non asocciated cliente', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      perfilAdquisitivo: faker.datatype.number(),
      saldo: faker.datatype.number(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
    });

    await expect(() => service.deleteClienteReserva(reserva.id, newCliente.id)).rejects.toHaveProperty("message", "The cliente with the given id is not associated to the reserva");
  });

});

