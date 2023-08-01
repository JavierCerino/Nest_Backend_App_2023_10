/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { ClienteEntity } from '../cliente/cliente.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EstablecimientoClienteService } from './establecimiento-cliente.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { AdministradorEstablecimientoEntity } from '../administrador_establecimiento/administrador_establecimiento.entity';

describe('EstablecimientoClienteService', () => {
  let service: EstablecimientoClienteService;
  let establecimientoRepository: Repository<EstablecimientoEntity>;
  let clienteRepository: Repository<ClienteEntity>;
  let establecimiento: EstablecimientoEntity;
  let repositotyAdmin: Repository<AdministradorEstablecimientoEntity>;
  let adminEsta: AdministradorEstablecimientoEntity;
  let clientesList : ClienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstablecimientoClienteService],
    }).compile();

    service = module.get<EstablecimientoClienteService>(EstablecimientoClienteService);
    establecimientoRepository = module.get<Repository<EstablecimientoEntity>>(getRepositoryToken(EstablecimientoEntity));
    clienteRepository = module.get<Repository<ClienteEntity>>(getRepositoryToken(ClienteEntity));
    repositotyAdmin = module.get<Repository<AdministradorEstablecimientoEntity>>(getRepositoryToken(AdministradorEstablecimientoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    clienteRepository.clear();
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

    clientesList = [];
    for(let i = 0; i < 5; i++){
        const cliente: ClienteEntity = await clienteRepository.save({
          nombre: faker.name.firstName(),
          apellido: faker.name.lastName(),
          usuario: faker.internet.userName(),
          contraseña: faker.internet.password(),
          correo: faker.internet.email(),
          image: faker.image.imageUrl(),
          perfilAdquisitivo: parseInt(faker.random.numeric()),
          saldo: parseInt(faker.random.numeric())
        });
        clientesList.push(cliente);
    }

    establecimiento = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      clientes: clientesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addClienteEstablecimiento should add a cliente to an establecimiento', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: parseInt(faker.random.numeric()),
      saldo: parseInt(faker.random.numeric())
    });
      const clientes: ClienteEntity[] = [];
      clientes.push(newCliente);

    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      clientes: clientes
    })

    const result: EstablecimientoEntity = await service.addClienteEstablecimiento(newEstablecimiento.id, newCliente.id);
    
    expect(result.clientes.length).toBe(2);
    expect(result.clientes[0].nombre).toBe(newCliente.nombre);
    expect(result.clientes[0].apellido).toBe(newCliente.apellido);
    expect(result.clientes[0].usuario).toBe(newCliente.usuario);
    expect(result.clientes[0].contraseña).toBe(newCliente.contraseña);
    expect(result.clientes[0].correo).toBe(newCliente.correo);
    expect(result.clientes[0].image).toBe(newCliente.image);
    expect(result.clientes[0].saldo).toBe(newCliente.saldo);
    expect(result.clientes[0].perfilAdquisitivo).toBe(newCliente.perfilAdquisitivo);
  });

  it('addClienteEstablecimiento should thrown exception for an invalid cliente', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      clientes: clientesList
    })

    await expect(() => service.addClienteEstablecimiento(newEstablecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el cliente con el clienteId: ");
  });

  it('addClienteEstablecimiento should throw an exception for an invalid establecimiento', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: parseInt(faker.random.numeric()),
      saldo: parseInt(faker.random.numeric())
    });

    await expect(() => service.addClienteEstablecimiento("0", newCliente.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: ");
  });

  it('findClienteByEstablecimientoIdClienteId should return cliente by establecimiento', async () => {
    const cliente: ClienteEntity = clientesList[0];
    const storedCliente: ClienteEntity = await service.findClienteByEstablecimientoIdClienteId(establecimiento.id, cliente.id, )
    expect(storedCliente).not.toBeNull();
    expect(storedCliente.nombre).toBe(cliente.nombre);
    expect(storedCliente.apellido).toBe(cliente.apellido);
    expect(storedCliente.usuario).toBe(cliente.usuario);
    expect(storedCliente.contraseña).toBe(cliente.contraseña);
    expect(storedCliente.correo).toBe(cliente.correo);
    expect(storedCliente.image).toBe(cliente.image);
    expect(storedCliente.saldo).toBe(cliente.saldo);
    expect(storedCliente.perfilAdquisitivo).toBe(cliente.perfilAdquisitivo);
  });

  it('findClienteByEstablecimientoIdClienteId should throw an exception for an invalid cliente', async () => {
    await expect(()=> service.findClienteByEstablecimientoIdClienteId(establecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el cliente con el clienteId: "); 
  });

  it('findClienteByEstablecimientoIdClienteId should throw an exception for an invalid establecimiento', async () => {
    const cliente: ClienteEntity = clientesList[0]; 
    await expect(()=> service.findClienteByEstablecimientoIdClienteId("0", cliente.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('findClienteByEstablecimientoIdClienteId should throw an exception for a cliente not associated to the establecimiento', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: parseInt(faker.random.numeric()),
      saldo: parseInt(faker.random.numeric())
    });

    await expect(()=> service.findClienteByEstablecimientoIdClienteId(establecimiento.id, newCliente.id)).rejects.toHaveProperty("message", "El  cliente con el id dado no esta asociado con el establecimiento"); 
  });

  it('findClientesByEstablecimientoId should return clientes by establecimiento', async ()=>{
    const clientes: ClienteEntity[] = await service.findClientesByEstablecimientoId(establecimiento.id);
    expect(clientes.length).toBe(5)
  });

  it('findClientesByEstablecimientoId should throw an exception for an invalid establecimiento', async () => {
    await expect(()=> service.findClientesByEstablecimientoId("0")).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('associateClientesEstablecimiento should update clientes list for an establecimiento', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: parseInt(faker.random.numeric()),
      saldo: parseInt(faker.random.numeric())
    });

    const updatedEstablecimiento: EstablecimientoEntity = await service.associateClientesEstablecimiento(establecimiento.id, [newCliente]);
    expect(updatedEstablecimiento.clientes.length).toBe(1);

    expect(updatedEstablecimiento.clientes[0].nombre).toBe(newCliente.nombre);
    expect(updatedEstablecimiento.clientes[0].apellido).toBe(newCliente.apellido);
    expect(updatedEstablecimiento.clientes[0].contraseña).toBe(newCliente.contraseña);
    expect(updatedEstablecimiento.clientes[0].usuario).toBe(newCliente.usuario);
    expect(updatedEstablecimiento.clientes[0].correo).toBe(newCliente.correo);
    expect(updatedEstablecimiento.clientes[0].image).toBe(newCliente.image);
    expect(updatedEstablecimiento.clientes[0].saldo).toBe(newCliente.saldo);
    expect(updatedEstablecimiento.clientes[0].perfilAdquisitivo).toBe(newCliente.perfilAdquisitivo);
  });

  it('associateClientesEstablecimiento should throw an exception for an invalid establecimiento', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: parseInt(faker.random.numeric()),
      saldo: parseInt(faker.random.numeric())
    });

    await expect(()=> service.associateClientesEstablecimiento("0", [newCliente])).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('associateClientesEstablecimiento should throw an exception for an invalid cliente', async () => {
    const newCliente: ClienteEntity = clientesList[0];
    newCliente.id = "0";

    await expect(()=> service.associateClientesEstablecimiento(establecimiento.id, [newCliente])).rejects.toHaveProperty("message", "No existe el cliente con el clienteId: "); 
  });

  it('deleteClienteToEstablecimiento should remove a cliente from an establecimiento', async () => {
    const cliente: ClienteEntity = clientesList[0];
    
    await service.deleteClienteEstablecimiento(establecimiento.id, cliente.id);

    const storedEstablecimiento: EstablecimientoEntity = await establecimientoRepository.findOne({where: {id: establecimiento.id}, relations: ["clientes"]});
    const deletedCliente: ClienteEntity = storedEstablecimiento.clientes.find(a => a.id === cliente.id);

    expect(deletedCliente).toBeUndefined();

  });

  it('deleteClienteToEstablecimiento should thrown an exception for an invalid cliente', async () => {
    await expect(()=> service.deleteClienteEstablecimiento(establecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el cliente con el clienteId: "); 
  });

  it('deleteClienteToEstablecimiento should thrown an exception for an invalid establecimiento', async () => {
    const cliente: ClienteEntity = clientesList[0];
    await expect(()=> service.deleteClienteEstablecimiento("0", cliente.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('deleteClienteToEstablecimiento should thrown an exception for an non asocciated cliente', async () => {
    const newCliente: ClienteEntity = await clienteRepository.save({
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      usuario: faker.internet.userName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl(),
      perfilAdquisitivo: parseInt(faker.random.numeric()),
      saldo: parseInt(faker.random.numeric())
    });

    await expect(()=> service.deleteClienteEstablecimiento(establecimiento.id, newCliente.id)).rejects.toHaveProperty("message", "El  cliente con el id dado no esta asociado con el establecimiento"); 
  }); 

});