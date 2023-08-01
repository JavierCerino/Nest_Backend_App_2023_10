/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { faker } from '@faker-js/faker';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<UsuarioEntity>;
  let usuariosList: UsuarioEntity[];
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();
 
    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    usuariosList = [];
    for(let i = 0; i < 5; i++){
      const usuario: UsuarioEntity = await repository.save({
      usuario: faker.internet.userName(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl()})
      usuariosList.push(usuario);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all usuarios', async () => {
    const usuarios: UsuarioEntity[] = await service.findAll();
    expect(usuarios).not.toBeNull();
    expect(usuarios).toHaveLength(usuariosList.length);
  });

  it('findOne should return an usuario by id', async () => {
    const storedUsuario: UsuarioEntity = usuariosList[0];
    const usuario: UsuarioEntity = await service.findOne(storedUsuario.id);
    expect(usuario).not.toBeNull();
    expect(usuario.usuario).toEqual(storedUsuario.usuario)
    expect(usuario.nombre).toEqual(storedUsuario.nombre)
    expect(usuario.apellido).toEqual(storedUsuario.apellido)
    expect(usuario.contraseña).toEqual(storedUsuario.contraseña)
    expect(usuario.correo).toEqual(storedUsuario.correo)
    expect(usuario.image).toEqual(storedUsuario.image)
  });

  it('findOne should throw an exception for an invalid usuario', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The usuario with the given id was not found")
  });
 
  it('create should return a new usuario', async () => {
    const usuario: UsuarioEntity = {
      id: "",
      usuario: faker.internet.userName(),
      nombre: faker.name.firstName(),
      apellido: faker.name.lastName(),
      contraseña: faker.internet.password(),
      correo: faker.internet.email(),
      image: faker.image.imageUrl()
    }

    const newUsuario: UsuarioEntity = await service.create(usuario);
    expect(newUsuario).not.toBeNull();

    const storedUsuario: UsuarioEntity = await repository.findOne({where: {id: newUsuario.id}})
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.usuario).toEqual(newUsuario.usuario)
    expect(storedUsuario.nombre).toEqual(newUsuario.nombre)
    expect(storedUsuario.apellido).toEqual(newUsuario.apellido)
    expect(storedUsuario.contraseña).toEqual(newUsuario.contraseña)
    expect(storedUsuario.correo).toEqual(newUsuario.correo)
    expect(storedUsuario.image).toEqual(newUsuario.image)
  });

  it('update should modify an usuario', async () => {
    const usuario: UsuarioEntity = usuariosList[0];
    usuario.usuario = "New usuario";
    usuario.contraseña = "New contraseña";
  
    const updatedUsuario: UsuarioEntity = await service.update(usuario.id, usuario);
    expect(updatedUsuario).not.toBeNull();
  
    const storedUsuario: UsuarioEntity = await repository.findOne({ where: { id: usuario.id } })
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.usuario).toEqual(usuario.usuario)
    expect(storedUsuario.contraseña).toEqual(usuario.contraseña)
  });

  it('update should throw an exception for an invalid usuario', async () => {
    let usuario: UsuarioEntity = usuariosList[0];
    usuario = {
      ...usuario, usuario: "New usuario", contraseña: "New contraseña"
    }
    await expect(() => service.update("0", usuario)).rejects.toHaveProperty("message", "The usuario with the given id was not found")
  });

  it('delete should remove an usuario', async () => {
    const usuario: UsuarioEntity = usuariosList[0];
    await service.delete(usuario.id);
  
    const deletedUsuario: UsuarioEntity = await repository.findOne({ where: { id: usuario.id } })
    expect(deletedUsuario).toBeNull();
  });

  it('delete should throw an exception for an invalid usuario', async () => {
    const usuario: UsuarioEntity = usuariosList[0];
    await service.delete(usuario.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The usuario with the given id was not found")
  });

});
 
