/* eslint-disable prettier/prettier */
import { ProductoEntity } from '../producto/producto.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { ClienteEntity } from '../cliente/cliente.entity';

@Entity()
export class ReservaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fecha: Date;

    @Column()
    mesaAsignada: number;

    @Column()
    numPersonas: number;

    @Column()
    tipo: string;

    @Column()
    descripcion: string;

    //Many to one Relationship with Establecimiento
    
    @ManyToOne(()=>EstablecimientoEntity, establecimiento => establecimiento.reservas)
    establecimiento: EstablecimientoEntity;

    //Many to Many Relationship with Cliente
    @ManyToMany(() => ProductoEntity, producto => producto.reservas)
    @JoinTable()
    productos: ProductoEntity[];

    //Many to Many relationship with Cliente
    @ManyToMany(() => ClienteEntity, cliente => cliente.reservasAsignadas)
    clientes: ClienteEntity[];

}
