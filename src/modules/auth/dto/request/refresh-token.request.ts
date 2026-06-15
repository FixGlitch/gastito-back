import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenRequestDto {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "Refresh token válido",
  })
  @IsString({ message: "El refresh token es obligatorio" })
  @IsNotEmpty({ message: "El refresh token no puede estar vacío" })
  refreshToken: string;
}
