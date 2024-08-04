import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

   @IsOptional()
   @IsPositive()
   @Type( ()=> Number ) // enabledExplicitConversion
   limit?: number;
   
   @IsPositive()
   @IsOptional()
   @Min(0)
   @Type( ()=> Number ) // enabledExplicitConversion
   offset?: number;
}