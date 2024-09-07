import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

   @ApiProperty({
      default: 10,
      description: 'how many items per page'
   })
   @IsOptional()
   @IsPositive()
   @Type( ()=> Number ) // enabledExplicitConversion
   limit?: number;
   
   @ApiProperty({
      default: 0,
      description: 'How many items per page skip'
   })
   @IsPositive()
   @IsOptional()
   @Min(0)
   @Type( ()=> Number ) // enabledExplicitConversion
   offset?: number;
}