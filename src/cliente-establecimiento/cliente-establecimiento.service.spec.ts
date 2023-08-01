/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { Repository } from 'typeorm';
import { ClienteEntity } from '../cliente/cliente.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClienteEstablecimientoService } from './cliente-establecimiento.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClienteEstablecimientoService', () => {
  let service: ClienteEstablecimientoService;
  let clienteRepository: Repository<ClienteEntity>;
  let establecimientoRepository: Repository<EstablecimientoEntity>;
  let cliente: ClienteEntity;
  let establecimientosList : EstablecimientoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClienteEstablecimientoService],
    }).compile();

    service = module.get<ClienteEstablecimientoService>(ClienteEstablecimientoService);
    clienteRepository = module.get<Repository<ClienteEntity>>(getRepositoryToken(ClienteEntity));
    establecimientoRepository = module.get<Repository<EstablecimientoEntity>>(getRepositoryToken(EstablecimientoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    establecimientoRepository.clear();
    clienteRepository.clear();

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

    cliente = await clienteRepository.save({
      usuario: faker.internet.userName(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: Number(faker.random.numeric(6)),
      saldo: Number(faker.random.numeric(6)),
      establecimientosFav: establecimientosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addEstablecimientoCliente should add an establecimiento to a cliente', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(),
      capacidad: Number(faker.random.numeric(2)),
      costoPromedio: Number(faker.random.numeric(3)),
      calificacionPromedio: Number(faker.random.numeric(1)),
      image: faker.image.imageUrl()
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
    const result: ClienteEntity = await service.addEstablecimientoCliente(newCliente.id, newEstablecimiento.id);
    
    expect(result.establecimientosFav.length).toBe(1);
    expect(result.establecimientosFav[0]).not.toBeNull();
    expect(result.establecimientosFav[0].nombre).toBe(newEstablecimiento.nombre)
    expect(result.establecimientosFav[0].direccion).toBe(newEstablecimiento.direccion)
    expect(result.establecimientosFav[0].capacidad).toBe(newEstablecimiento.capacidad)
    expect(result.establecimientosFav[0].costoPromedio).toBe(newEstablecimiento.costoPromedio)
    expect(result.establecimientosFav[0].calificacionPromedio).toBe(newEstablecimiento.calificacionPromedio)
  });

  it('addEstablecimientoCliente should throw an exception for an invalid cliente', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(),
      capacidad: Number(faker.random.numeric(2)),
      costoPromedio: Number(faker.random.numeric(3)),
      calificacionPromedio: Number(faker.random.numeric(1)),
      image: faker.image.imageUrl()
    });

    await expect(() => service.addEstablecimientoCliente("0", newEstablecimiento.id)).rejects.toHaveProperty("message", "The cliente with the given id was not found");
  });

  it('findEstablecimientoByClienteIdEstablecimientoId should return establecimiento by cliente', async () => {
    const establecimiento: EstablecimientoEntity = establecimientosList[0];
    const storedEstablecimiento: EstablecimientoEntity = await service.findEstablecimientoByClienteIdEstablecimientoId(cliente.id, establecimiento.id )
    expect(storedEstablecimiento).not.toBeNull();
    expect(storedEstablecimiento.nombre).toStrictEqual(establecimiento.nombre)
    expect(storedEstablecimiento.direccion).toStrictEqual(establecimiento.direccion)
    expect(storedEstablecimiento.capacidad).toStrictEqual(establecimiento.capacidad)
    expect(storedEstablecimiento.costoPromedio).toStrictEqual(establecimiento.costoPromedio)
    expect(storedEstablecimiento.calificacionPromedio).toStrictEqual(establecimiento.calificacionPromedio),
    expect(storedEstablecimiento.image).toStrictEqual(establecimiento.image)
  });

  it('findEstablecimientoByClienteIdEstablecimientoId should throw an exception for an invalid establecimiento', async () => {
    await expect(()=> service.findEstablecimientoByClienteIdEstablecimientoId(cliente.id, "0")).rejects.toHaveProperty("message", "The establecimiento with the given id was not found"); 
  });

  it('findEstablecimientoByMuseumIdEstablecimientoId should throw an exception for an invalid cliente', async () => {
    const establecimiento: EstablecimientoEntity = establecimientosList[0]; 
    await expect(()=> service.findEstablecimientoByClienteIdEstablecimientoId("0", establecimiento.id)).rejects.toHaveProperty("message", "The cliente with the given id was not found"); 
  });

  it('findEstablecimientoByClienteIdEstablecimientoId should throw an exception for an establecimiento not associated to the cliente', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(),
      capacidad: Number(faker.random.numeric(2)),
      costoPromedio: Number(faker.random.numeric(3)),
      calificacionPromedio: Number(faker.random.numeric(1)),
      image: faker.image.imageUrl()
    });

    await expect(()=> service.findEstablecimientoByClienteIdEstablecimientoId(cliente.id, newEstablecimiento.id)).rejects.toHaveProperty("message", "The establecimiento with the given id is not associated to the cliente"); 
  });

  it('findEstablecimientosByClienteId should return establecimientos by cliente', async ()=>{
    const establecimientos: EstablecimientoEntity[] = await service.findEstablecimientosByClienteId(cliente.id);
    expect(establecimientos.length).toBe(5)
  });

  it('findEstablecimientosByClienteId should throw an exception for an invalid cliente', async () => {
    await expect(()=> service.findEstablecimientosByClienteId("0")).rejects.toHaveProperty("message", "The cliente with the given id was not found"); 
  });

  it('associateEstablecimientosCliente should update establecimientos list for a cliente', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(),
      capacidad: Number(faker.random.numeric(2)),
      costoPromedio: Number(faker.random.numeric(3)),
      calificacionPromedio: Number(faker.random.numeric(1)),
      image: faker.image.imageUrl()
    });

    const updatedCliente: ClienteEntity = await service.associateEstablecimientosCliente(cliente.id, [newEstablecimiento]);
    expect(updatedCliente.establecimientosFav.length).toBe(1);

    expect(updatedCliente.establecimientosFav[0].nombre).toBe(newEstablecimiento.nombre);
    expect(updatedCliente.establecimientosFav[0].direccion).toBe(newEstablecimiento.direccion);
    expect(updatedCliente.establecimientosFav[0].capacidad).toBe(newEstablecimiento.capacidad);
    expect(updatedCliente.establecimientosFav[0].costoPromedio).toBe(newEstablecimiento.costoPromedio);
    expect(updatedCliente.establecimientosFav[0].calificacionPromedio).toBe(newEstablecimiento.calificacionPromedio);
    expect(updatedCliente.establecimientosFav[0].image).toBe(newEstablecimiento.image);
  });

  it('associateEstablecimientosCliente should throw an exception for an invalid cliente', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(),
      capacidad: Number(faker.random.numeric(2)),
      costoPromedio: Number(faker.random.numeric(3)),
      calificacionPromedio: Number(faker.random.numeric(1)),
      image: faker.image.imageUrl()
    });

    await expect(()=> service.associateEstablecimientosCliente("0", [newEstablecimiento])).rejects.toHaveProperty("message", "The cliente with the given id was not found"); 
  });

  it('associateEstablecimientosCliente should throw an exception for an invalid establecimiento', async () => {
    const newEstablecimiento: EstablecimientoEntity = establecimientosList[0];
    newEstablecimiento.id = "0";

    await expect(()=> service.associateEstablecimientosCliente(cliente.id, [newEstablecimiento])).rejects.toHaveProperty("message", "The establecimiento with the given id was not found"); 
  });

  it('deleteEstablecimientoToCliente should remove an establecimiento from a cliente', async () => {
    const establecimiento: EstablecimientoEntity = establecimientosList[0];
    
    await service.deleteEstablecimientoCliente(cliente.id, establecimiento.id);

    const storedCliente: ClienteEntity = await clienteRepository.findOne({where: {id: cliente.id}, relations: ["establecimientosFav"]});
    const deletedEstablecimiento: EstablecimientoEntity = storedCliente.establecimientosFav.find(a => a.id === establecimiento.id);

    expect(deletedEstablecimiento).toBeUndefined();

  });

  it('deleteEstablecimientoToCliente should thrown an exception for an invalid establecimiento', async () => {
    await expect(()=> service.deleteEstablecimientoCliente(cliente.id, "0")).rejects.toHaveProperty("message", "The establecimiento with the given id was not found"); 
  });

  it('deleteEstablecimientoToCliente should thrown an exception for an invalid cliente', async () => {
    const establecimiento: EstablecimientoEntity = establecimientosList[0];
    await expect(()=> service.deleteEstablecimientoCliente("0", establecimiento.id)).rejects.toHaveProperty("message", "The cliente with the given id was not found"); 
  });

  it('deleteEstablecimientoToCliente should thrown an exception for an non asocciated establecimiento', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(),
      capacidad: Number(faker.random.numeric(2)),
      costoPromedio: Number(faker.random.numeric(3)),
      calificacionPromedio: Number(faker.random.numeric(1)),
      image: faker.image.imageUrl()
    });

    await expect(()=> service.deleteEstablecimientoCliente(cliente.id, newEstablecimiento.id)).rejects.toHaveProperty("message", "The establecimiento with the given id is not associated to the cliente"); 
  }); 

});