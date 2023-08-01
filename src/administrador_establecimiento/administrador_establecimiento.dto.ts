/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString} from 'class-validator';
export class AdministradorEstablecimientoDto {
    
    @IsString()
    @IsNotEmpty()
    readonly usuario: string;

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly apellido: string;

    @IsString()
    @IsNotEmpty()
    readonly contraseña: string;

    @IsString()
    @IsNotEmpty()
    readonly correo: string;

    @IsString()
    @IsNotEmpty()
    readonly image: string;
}