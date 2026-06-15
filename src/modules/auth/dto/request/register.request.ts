import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterRequestDto {
  @ApiProperty({ example: "Juan Pérez", description: "Nombre completo" })
  @IsString({ message: "El nombre es obligatorio" })
  @MinLength(2, { message: "El nombre debe tener al menos 2 caracteres" })
  @MaxLength(100, { message: "El nombre no puede superar los 100 caracteres" })
  name: string;

  @ApiProperty({ example: "juan@email.com", description: "Correo electrónico" })
  @IsEmail({}, { message: "Ingresá un correo electrónico válido" })
  email: string;

  @ApiProperty({
    example: "miPassword123",
    description: "Contraseña (mínimo 6 caracteres)",
  })
  @IsString({ message: "La contraseña es obligatoria" })
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  @MaxLength(100, { message: "La contraseña no puede superar los 100 caracteres" })
  password: string;

  @ApiPropertyOptional({
    example: "https://example.com/avatar.jpg",
    description: "URL de la foto de perfil (opcional)",
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
