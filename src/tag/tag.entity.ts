/* eslint-disable prettier/prettier */
import { ClienteEntity } from '../cliente/cliente.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TagEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @ManyToMany(()=>EstablecimientoEntity,establecimientos => establecimientos.tagsEstablecimiento)
    establecimientos: EstablecimientoEntity[];

    @ManyToMany(()=>ClienteEntity,clientes => clientes.tagsCliente)
    clientes: ClienteEntity[];
}
