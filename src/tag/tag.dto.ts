/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString} from "class-validator";

export class TagDto {

    @IsNotEmpty()
    @IsString()
    readonly nombre: string;
}
