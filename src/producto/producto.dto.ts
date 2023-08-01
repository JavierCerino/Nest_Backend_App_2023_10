import {IsNotEmpty, IsNumber, IsString} from 'class-validator';
export class ProductoDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsNotEmpty()
 readonly tipoProducto: string;
 
@IsNumber()
@IsNotEmpty()
readonly precio: number;

@IsString()
@IsNotEmpty()
readonly image: string;
}