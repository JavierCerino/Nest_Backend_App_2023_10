/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { AdministradorEstablecimientoDto } from "src/administrador_establecimiento/administrador_establecimiento.dto";

export class EstablecimientoDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly direccion: string;

    @IsNumber()
    @IsNotEmpty()
    readonly capacidad: number;

    @IsNumber()
    @IsNotEmpty()
    readonly costoPromedio: number;

    @IsNumber()
    @IsNotEmpty()
    readonly calificacionPromedio: number;

    @IsString()
    @IsNotEmpty()
    readonly image: string;
    
    @IsNotEmpty()
    readonly adminEst: AdministradorEstablecimientoDto;

}
