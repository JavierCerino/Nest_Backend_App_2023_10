/* eslint-disable prettier/prettier */
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { ReseniaEntity } from '../resenia/resenia.entity';
import { ReservaEntity } from '../reserva/reserva.entity';
import { TagEntity } from '../tag/tag.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClienteEntity extends UsuarioEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    perfilAdquisitivo: number;

    @Column()
    saldo: number;

    @ManyToMany(() => ReservaEntity, reserva => reserva.clientes)
    @JoinTable()
    reservasAsignadas: ReservaEntity[];

    @OneToMany(() => ReseniaEntity, resenia => resenia.cliente)
    resenias: ReseniaEntity[];

    @ManyToMany(() => EstablecimientoEntity, establecimiento => establecimiento.clientes)
    establecimientosFav: EstablecimientoEntity[];

    @ManyToMany(() => TagEntity, tag => tag.clientes)
    @JoinTable()
    tagsCliente: TagEntity[];

}
