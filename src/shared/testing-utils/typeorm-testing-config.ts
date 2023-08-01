/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromocionEntity } from '../../promocion/promocion.entity';
import { MenuEntity } from '../../menu/menu.entity';
import { ProductoEntity } from '../../producto/producto.entity';
import { ReservaEntity } from '../../reserva/reserva.entity';
import { EstablecimientoEntity } from '../../establecimiento/establecimiento.entity';
import { TagEntity } from '../../tag/tag.entity';
import { UsuarioEntity } from '../../usuario/usuario.entity';
import { AdministradorEstablecimientoEntity } from '../../administrador_establecimiento/administrador_establecimiento.entity';
import { ClienteEntity } from '../../cliente/cliente.entity';
import { ReseniaEntity } from '../../resenia/resenia.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [MenuEntity,
      PromocionEntity,
      ProductoEntity,
      ReservaEntity,
      ReseniaEntity,
      EstablecimientoEntity,
      TagEntity,
      UsuarioEntity,
      AdministradorEstablecimientoEntity,
      ClienteEntity],
    synchronize: true,
    keepConnectionAlive: true 
  }),
  TypeOrmModule.forFeature([MenuEntity,
    PromocionEntity,
    ProductoEntity,
    ReservaEntity,
    ReseniaEntity,
    EstablecimientoEntity,
    TagEntity,
    UsuarioEntity,
    AdministradorEstablecimientoEntity,
    ClienteEntity]),
];
