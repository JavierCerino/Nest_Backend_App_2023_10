import {IsNotEmpty, IsString, IsNumber, IsDateString} from 'class-validator';
import { EstablecimientoDto } from '../establecimiento/establecimiento.dto';
export class ReservaDto {

 @IsDateString()
 @IsNotEmpty()
 readonly fecha: Date;
 
 @IsNumber()
 @IsNotEmpty()
 readonly mesaAsignada: number;
 
 @IsNumber()
 @IsNotEmpty()
 readonly numPersonas: number;
 
 @IsString()
 @IsNotEmpty()
 readonly tipo: string;
 
 @IsString()
 @IsNotEmpty()
 readonly descripcion: string;

 @IsNotEmpty()
 readonly establecimiento: EstablecimientoDto

}
