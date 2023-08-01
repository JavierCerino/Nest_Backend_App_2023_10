import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class PromocionDto {

 @IsString()
 @IsNotEmpty()
 readonly tipo: string;
 
 @IsString()
 @IsNotEmpty()
 readonly descripcion: string;
}