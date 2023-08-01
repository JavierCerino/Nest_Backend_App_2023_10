/* eslint-disable prettier/prettier */
import { MenuModule } from './menu/menu.module';
import { PromocionModule } from './promocion/promocion.module';
import { ProductoModule } from './producto/producto.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservaModule } from './reserva/reserva.module';
import { ReseniaModule } from './resenia/resenia.module';
import { EstablecimientoModule } from './establecimiento/establecimiento.module';
import { TagModule } from './tag/tag.module';
import { ClienteModule } from './cliente/cliente.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { AdministradorEstablecimientoModule } from './administrador_establecimiento/administrador_establecimiento.module';
import { EstablecimientoEntity } from './establecimiento/establecimiento.entity';
import { MenuEntity } from './menu/menu.entity';
import { PromocionEntity } from './promocion/promocion.entity';
import { ProductoEntity } from './producto/producto.entity';
import { ReservaEntity } from './reserva/reserva.entity';
import { TagEntity } from './tag/tag.entity';
import { UsuarioEntity } from './usuario/usuario.entity';
import { AdministradorEstablecimientoEntity } from './administrador_establecimiento/administrador_establecimiento.entity';
import { ClienteEntity } from './cliente/cliente.entity';
import { ReseniaEntity } from './resenia/resenia.entity';
import { ReservaClienteModule } from './reserva-cliente/reserva-cliente.module';
import { ReservaProductoModule } from './reserva-producto/reserva-producto.module';
import { EstablecimientoClienteModule } from './establecimiento-cliente/establecimiento-cliente.module';
import { AdministradorEstablecimientoEstablecimientoModule } from './administrador_establecimiento-establecimiento/administrador_establecimiento-establecimiento.module';
import { ClienteEstablecimientoModule } from './cliente-establecimiento/cliente-establecimiento.module';
import { ClienteReservaModule } from './cliente-reserva/cliente-reserva.module';
import { ClienteTagModule } from './cliente-tag/cliente-tag.module';
import { EstablecimientoMenuModule } from './establecimiento-menu/establecimiento-menu.module';
import { EstablecimientoPromocionModule } from './establecimiento-promocion/establecimiento-promocion.module';
import { EstablecimientoReseniaModule } from './establecimiento-resenia/establecimiento-resenia.module';
import { EstablecimientoReservaModule } from './establecimiento-reserva/establecimiento-reserva.module';
import { EstablecimientoTagModule } from './establecimiento-tag/establecimiento-tag.module';
import { MenuProductoModule } from './menu-producto/menu-producto.module';
import { ProductoPromocionModule } from './producto-promocion/producto-promocion.module';
import { PromocionProductoModule } from './promocion-producto/promocion-producto.module';
import { ClienteReseniaModule } from './cliente-resenia/cliente-resenia.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    MenuProductoModule,
    ProductoPromocionModule,
    PromocionProductoModule,
    MenuModule,
    PromocionModule,
    ProductoModule,
    ReservaModule,
    ReseniaModule,
    AdministradorEstablecimientoModule,
    AdministradorEstablecimientoEstablecimientoModule,
    ClienteModule,
    ClienteEstablecimientoModule,
    ClienteReseniaModule,
    ClienteReservaModule,
    ClienteTagModule,
    ClienteReseniaModule,
    EstablecimientoModule,
    EstablecimientoClienteModule,
    EstablecimientoMenuModule,
    EstablecimientoPromocionModule,
    EstablecimientoReseniaModule,
    EstablecimientoReservaModule,
    EstablecimientoTagModule,
    MenuModule,
    MenuProductoModule,
    ProductoModule,
    ProductoPromocionModule,
    PromocionModule,
    PromocionProductoModule,
    ReseniaModule,
    ReservaModule,
    ReservaClienteModule,
    ReservaProductoModule,
    TagModule,
    UsuarioModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'eathere',
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
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    UserModule,
    AuthModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
