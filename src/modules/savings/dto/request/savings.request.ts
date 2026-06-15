import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  Min,
  MaxLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateSavingsGoalRequestDto {
  @ApiProperty({ example: "Fondo de emergencia", description: "Nombre de la meta" })
  @IsString({ message: "El nombre es obligatorio" })
  @MaxLength(150, { message: "El nombre no puede superar los 150 caracteres" })
  name: string;

  @ApiProperty({ example: 500000, description: "Monto objetivo en ARS" })
  @IsNumber({}, { message: "El monto debe ser un número válido" })
  @Min(1, { message: "El monto debe ser mayor a 0" })
  targetAmount: number;

  @ApiPropertyOptional({ example: "2027-12-31", description: "Fecha objetivo (YYYY-MM-DD)" })
  @IsOptional()
  @IsDateString({}, { message: "Ingresá una fecha válida" })
  targetDate?: string;
}

export class UpdateSavingsGoalRequestDto {
  @ApiPropertyOptional({ example: "Viaje a Bariloche" })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @ApiPropertyOptional({ example: 800000 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  targetAmount?: number;

  @ApiPropertyOptional({ example: 200000, description: "Monto a agregar al ahorro actual" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  isActive?: boolean;
}
