/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UsuarioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    usuario: string;

    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @Column()
    contraseña: string;

    @Column()
    correo: string;

    @Column()
    image: string;
}
