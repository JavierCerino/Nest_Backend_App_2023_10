/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';

@Entity()
export class PromocionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    tipo: string;
    @Column()
    descripcion: string;
    @ManyToMany(() => ProductoEntity, producto => producto.promociones) 
    productos: ProductoEntity[];
    @ManyToOne(()=>EstablecimientoEntity, establecimiento => establecimiento.promociones)
    establecimiento: EstablecimientoEntity[];
    

}