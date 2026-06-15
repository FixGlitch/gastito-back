import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginRequestDto {
  @ApiProperty({
    example: "usuario@email.com",
    description: "Correo electrónico del usuario",
  })
  @IsEmail({}, { message: "Ingresá un correo electrónico válido" })
  email: string;

  @ApiProperty({
    example: "miPassword123",
    description: "Contraseña del usuario (mínimo 6 caracteres)",
  })
  @IsString({ message: "La contraseña es obligatoria" })
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  password: string;
}
