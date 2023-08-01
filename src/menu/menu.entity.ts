/* eslint-disable prettier/prettier */
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';

@Entity()
export class MenuEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    nombre: string;
    @ManyToMany(() => ProductoEntity, producto => producto.menus)
    @JoinTable()
    productos: ProductoEntity[];
    @ManyToOne(() => EstablecimientoEntity, establecimiento => establecimiento.menus)
    establecimiento: EstablecimientoEntity;
}