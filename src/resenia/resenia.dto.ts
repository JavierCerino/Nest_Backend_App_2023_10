import {IsNotEmpty, IsString} from 'class-validator';
import { ClienteDto } from '../cliente/cliente.dto';
import { EstablecimientoDto } from '../establecimiento/establecimiento.dto';
export class ReseniaDto {

 @IsString()
 @IsNotEmpty()
 readonly tipo: string;
 
 @IsString()
 @IsNotEmpty()
 readonly descripcion: string;
 
 @IsNotEmpty()
 readonly cliente: ClienteDto

 @IsNotEmpty()
 readonly establecimiento: EstablecimientoDto

}
