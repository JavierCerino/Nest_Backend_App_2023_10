/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { MenuEntity } from '../menu/menu.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EstablecimientoMenuService } from './establecimiento-menu.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { AdministradorEstablecimientoEntity } from '../administrador_establecimiento/administrador_establecimiento.entity';

describe('EstablecimientoMenuService', () => {
  let service: EstablecimientoMenuService;
  let establecimientoRepository: Repository<EstablecimientoEntity>;
  let menuRepository: Repository<MenuEntity>;
  let establecimiento: EstablecimientoEntity;
  let menusList : MenuEntity[];
  let repositotyAdmin: Repository<AdministradorEstablecimientoEntity>;
  let adminEsta: AdministradorEstablecimientoEntity;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstablecimientoMenuService],
    }).compile();

    service = module.get<EstablecimientoMenuService>(EstablecimientoMenuService);
    establecimientoRepository = module.get<Repository<EstablecimientoEntity>>(getRepositoryToken(EstablecimientoEntity));
    menuRepository = module.get<Repository<MenuEntity>>(getRepositoryToken(MenuEntity));
    repositotyAdmin = module.get<Repository<AdministradorEstablecimientoEntity>>(getRepositoryToken(AdministradorEstablecimientoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    menuRepository.clear();
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
    menusList = [];
    for(let i = 0; i < 5; i++){
        const menu: MenuEntity = await menuRepository.save({
          nombre: faker.name.firstName()
        });
        menusList.push(menu);
    }

    establecimiento = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      menus: menusList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMenuEstablecimiento should add a menu to an establecimiento', async () => {
    const newMenu: MenuEntity = await menuRepository.save({
      nombre: faker.name.firstName(),
    });
      const menus: MenuEntity[] = [];
      menus.push(newMenu);

    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      menus: menus
    })

    const result: EstablecimientoEntity = await service.addMenuEstablecimiento(newEstablecimiento.id, newMenu.id);
    
    expect(result.menus.length).toBe(2);
    expect(result.menus[0].nombre).toBe(newMenu.nombre);
  });

  it('addMenuEstablecimiento should thrown exception for an invalid menu', async () => {
    const newEstablecimiento: EstablecimientoEntity = await establecimientoRepository.save({
      nombre: faker.name.firstName(),
      direccion: faker.address.streetAddress(),
      capacidad: +faker.random.numeric(),
      costoPromedio: +faker.random.numeric(),
      calificacionPromedio: +faker.random.numeric(),
      image: faker.image.imageUrl(),
      adminEst: adminEsta,
      menus: menusList
    })

    await expect(() => service.addMenuEstablecimiento(newEstablecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el menu con el menuId: ");
  });

  it('addMenuEstablecimiento should throw an exception for an invalid establecimiento', async () => {
    const newMenu: MenuEntity = await menuRepository.save({
      nombre: faker.name.firstName()
    });

    await expect(() => service.addMenuEstablecimiento("0", newMenu.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: ");
  });

  it('findMenuByEstablecimientoIdMenuId should return menu by establecimiento', async () => {
    const menu: MenuEntity = menusList[0];
    const storedMenu: MenuEntity = await service.findMenuByEstablecimientoIdMenuId(establecimiento.id, menu.id, )
    expect(storedMenu).not.toBeNull();
    expect(storedMenu.nombre).toBe(menu.nombre);
  });

  it('findMenuByEstablecimientoIdMenuId should throw an exception for an invalid menu', async () => {
    await expect(()=> service.findMenuByEstablecimientoIdMenuId(establecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el menu con el menuId: "); 
  });

  it('findMenuByEstablecimientoIdMenuId should throw an exception for an invalid establecimiento', async () => {
    const menu: MenuEntity = menusList[0]; 
    await expect(()=> service.findMenuByEstablecimientoIdMenuId("0", menu.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('findMenuByEstablecimientoIdMenuId should throw an exception for a menu not associated to the establecimiento', async () => {
    const newMenu: MenuEntity = await menuRepository.save({
      nombre: faker.name.firstName()
    });

    await expect(()=> service.findMenuByEstablecimientoIdMenuId(establecimiento.id, newMenu.id)).rejects.toHaveProperty("message", "El  menu con el id dado no esta asociado con el establecimiento"); 
  });

  it('findMenusByEstablecimientoId should return menus by establecimiento', async ()=>{
    const menus: MenuEntity[] = await service.findMenusByEstablecimientoId(establecimiento.id);
    expect(menus.length).toBe(5)
  });

  it('findMenusByEstablecimientoId should throw an exception for an invalid establecimiento', async () => {
    await expect(()=> service.findMenusByEstablecimientoId("0")).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('associateMenusEstablecimiento should update menus list for an establecimiento', async () => {
    const newMenu: MenuEntity = await menuRepository.save({
      nombre: faker.name.firstName()
    });

    const updatedEstablecimiento: EstablecimientoEntity = await service.associateMenusEstablecimiento(establecimiento.id, [newMenu]);
    expect(updatedEstablecimiento.menus.length).toBe(1);

    expect(updatedEstablecimiento.menus[0].nombre).toBe(newMenu.nombre);
  });

  it('associateMenusEstablecimiento should throw an exception for an invalid establecimiento', async () => {
    const newMenu: MenuEntity = await menuRepository.save({
      nombre: faker.name.firstName()
    });

    await expect(()=> service.associateMenusEstablecimiento("0", [newMenu])).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('associateMenusEstablecimiento should throw an exception for an invalid menu', async () => {
    const newMenu: MenuEntity = menusList[0];
    newMenu.id = "0";

    await expect(()=> service.associateMenusEstablecimiento(establecimiento.id, [newMenu])).rejects.toHaveProperty("message", "No existe el menu con el menuId: "); 
  });

  it('deleteMenuToEstablecimiento should remove a menu from an establecimiento', async () => {
    const menu: MenuEntity = menusList[0];
    
    await service.deleteMenuEstablecimiento(establecimiento.id, menu.id);

    const storedEstablecimiento: EstablecimientoEntity = await establecimientoRepository.findOne({where: {id: establecimiento.id}, relations: ["menus"]});
    const deletedMenu: MenuEntity = storedEstablecimiento.menus.find(a => a.id === menu.id);

    expect(deletedMenu).toBeUndefined();

  });

  it('deleteMenuToEstablecimiento should thrown an exception for an invalid menu', async () => {
    await expect(()=> service.deleteMenuEstablecimiento(establecimiento.id, "0")).rejects.toHaveProperty("message", "No existe el menu con el menuId: "); 
  });

  it('deleteMenuToEstablecimiento should thrown an exception for an invalid establecimiento', async () => {
    const menu: MenuEntity = menusList[0];
    await expect(()=> service.deleteMenuEstablecimiento("0", menu.id)).rejects.toHaveProperty("message", "No existe el establecimiento con el establecimientoId: "); 
  });

  it('deleteMenuToEstablecimiento should thrown an exception for an non asocciated menu', async () => {
    const newMenu: MenuEntity = await menuRepository.save({
      nombre: faker.name.firstName()
    });

    await expect(()=> service.deleteMenuEstablecimiento(establecimiento.id, newMenu.id)).rejects.toHaveProperty("message", "El  menu con el id dado no esta asociado con el establecimiento"); 
  }); 

});