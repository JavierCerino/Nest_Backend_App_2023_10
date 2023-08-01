/* eslint-disable prettier/prettier */
import { ClienteEntity } from '../cliente/cliente.entity';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReseniaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tipo: string;

    @Column()
    descripcion: string;

    //Many to one Relationship with Cliente

    @ManyToOne(()=>ClienteEntity, cliente => cliente.resenias)
    cliente: ClienteEntity;

    //Many to one Relationship with Establecimiento
    @ManyToOne(()=>EstablecimientoEntity, establecimiento => establecimiento.resenias)
    establecimientos: EstablecimientoEntity;
}
