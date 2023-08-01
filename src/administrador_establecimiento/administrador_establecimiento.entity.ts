/* eslint-disable prettier/prettier */
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EstablecimientoEntity } from '../establecimiento/establecimiento.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';

@Entity()
export class AdministradorEstablecimientoEntity extends UsuarioEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @OneToMany(()=>EstablecimientoEntity, establecimiento=>establecimiento.adminEst)
    establecimientos: EstablecimientoEntity[];
}
