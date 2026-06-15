import {
  IsString,
  IsNumber,
  IsDateString,
  Min,
  MaxLength,
  IsOptional,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateExpenseRequestDto {
  @ApiProperty({ example: "Almuerzo en el centro", description: "Descripción del gasto" })
  @IsString({ message: "La descripción es obligatoria" })
  @MaxLength(200, { message: "La descripción no puede superar los 200 caracteres" })
  description: string;

  @ApiProperty({ example: 1500.50, description: "Monto del gasto en ARS" })
  @IsNumber({}, { message: "El monto debe ser un número válido" })
  @Min(0.01, { message: "El monto debe ser mayor a 0" })
  amount: number;

  @ApiProperty({ example: "Alimentos", description: "Categoría del gasto (dinámica)" })
  @IsString({ message: "La categoría es obligatoria" })
  @MaxLength(100, { message: "La categoría no puede superar los 100 caracteres" })
  category: string;

  @ApiProperty({ example: "2026-05-02", description: "Fecha del gasto (YYYY-MM-DD)" })
  @IsDateString({}, { message: "Ingresá una fecha válida (YYYY-MM-DD)" })
  date: string;

  @ApiPropertyOptional({ example: "Comida con compañeros de trabajo" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class UpdateExpenseRequestDto {
  @ApiPropertyOptional({ example: "Almuerzo modificado" })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @ApiPropertyOptional({ example: 2000 })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @ApiPropertyOptional({ example: "Transporte", description: "Categoría del gasto" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ example: "2026-05-03" })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receiptUrl?: string;

  @ApiPropertyOptional({ example: "Comida con compañeros de trabajo" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class ExpenseFiltersRequestDto {
  @ApiPropertyOptional({ example: "Alimentos", description: "Filtrar por categoría" })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: "2026-05", description: "Filtrar por mes (YYYY-MM)" })
  @IsOptional()
  @IsString()
  month?: string;

  @ApiPropertyOptional({ example: "almuerzo", description: "Buscar en descripción" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: "2026-05-01", description: "Fecha inicio (YYYY-MM-DD)" })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: "2026-05-31", description: "Fecha fin (YYYY-MM-DD)" })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 100, description: "Monto mínimo" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @ApiPropertyOptional({ example: 5000, description: "Monto máximo" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAmount?: number;
}
