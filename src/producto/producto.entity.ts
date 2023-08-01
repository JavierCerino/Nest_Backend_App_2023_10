/* eslint-disable prettier/prettier */
import { MenuEntity } from '../menu/menu.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PromocionEntity } from '../promocion/promocion.entity';
import { ReservaEntity } from '../reserva/reserva.entity';

@Entity()
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  nombre: string;
  @Column()
  tipoProducto: string;
  @Column()
  precio: number;
  @Column()
  image: string;
  //Many to Many relation with Reserva

  //Many to Many relation with PromocionEntity
  @ManyToMany(() => PromocionEntity, (promocion) => promocion.productos)
  @JoinTable()
  promociones: PromocionEntity[];
  @ManyToMany(() => MenuEntity, (menu) => menu.productos)
  menus: MenuEntity[];
  @ManyToMany(() => ReservaEntity, (reserva) => reserva.productos)
  reservas: ReservaEntity[];
}
