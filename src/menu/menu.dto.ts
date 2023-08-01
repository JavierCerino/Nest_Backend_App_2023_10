import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class MenuDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
    
}