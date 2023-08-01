/* eslint-disable prettier/prettier */
import { MenuEntity } from '../menu/menu.entity';
import { PromocionEntity } from '../promocion/promocion.entity';
import { ReservaEntity } from '../reserva/reserva.entity';
import { ReseniaEntity } from '../resenia/resenia.entity';
import { TagEntity } from '../tag/tag.entity';
import { Column, Entity, JoinTable, OneToMany, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AdministradorEstablecimientoEntity } from '../administrador_establecimiento/administrador_establecimiento.entity';
import { ClienteEntity } from '../cliente/cliente.entity';

@Entity()
export class EstablecimientoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    direccion: string;

    @Column()
    capacidad: number;

    @Column()
    costoPromedio: number;

    @Column()
    calificacionPromedio: number;

    @Column()
    image: string;

    @ManyToOne(()=>AdministradorEstablecimientoEntity,adminEst => adminEst.establecimientos)
    adminEst: AdministradorEstablecimientoEntity;

    @OneToMany(()=>PromocionEntity,promociones => promociones.establecimiento)
    promociones: PromocionEntity[];

    @OneToMany(()=>ReseniaEntity,resenias => resenias.establecimientos)
    resenias: ReseniaEntity[];

    @OneToMany(()=>MenuEntity,menus => menus.establecimiento)
    menus: MenuEntity[];

    @OneToMany(()=>ReservaEntity,reservas => reservas.establecimiento)
    reservas: ReservaEntity[];

    @ManyToMany(()=>ClienteEntity,clientes => clientes.establecimientosFav)
    @JoinTable()
    clientes: ClienteEntity[];

    @ManyToMany(()=>TagEntity,tagsEstablecimiento => tagsEstablecimiento.establecimientos)
    @JoinTable()
    tagsEstablecimiento: TagEntity[];

}