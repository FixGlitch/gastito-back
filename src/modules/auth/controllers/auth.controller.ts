import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "../services/auth.service";
import { LoginRequestDto } from "../dto/request/login.request";
import { RegisterRequestDto } from "../dto/request/register.request";
import { RefreshTokenRequestDto } from "../dto/request/refresh-token.request";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Registrar un nuevo usuario" })
  @ApiResponse({ status: 201, description: "Usuario registrado exitosamente" })
  @ApiResponse({ status: 409, description: "El correo ya está registrado" })
  async register(@Body() dto: RegisterRequestDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  @ApiOperation({ summary: "Iniciar sesión" })
  @ApiResponse({ status: 200, description: "Login exitoso" })
  @ApiResponse({ status: 401, description: "Credenciales inválidas" })
  async login(@Body() dto: LoginRequestDto) {
    return this.authService.login(dto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Obtener perfil del usuario autenticado" })
  @ApiResponse({ status: 200, description: "Perfil obtenido exitosamente" })
  @ApiResponse({ status: 401, description: "No autenticado" })
  async getProfile(@Req() req: { user: { id: string } }) {
    return this.authService.getProfile(req.user.id);
  }

  @Put("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Actualizar perfil del usuario" })
  @ApiResponse({ status: 200, description: "Perfil actualizado exitosamente" })
  async updateProfile(
    @Req() req: { user: { id: string } },
    @Body() data: { name?: string; email?: string; avatarUrl?: string },
  ) {
    return this.authService.updateProfile(req.user.id, data);
  }

  @Patch("password")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Cambiar contraseña" })
  @ApiResponse({ status: 200, description: "Contraseña actualizada exitosamente" })
  async updatePassword(
    @Req() req: { user: { id: string } },
    @Body() data: { currentPassword: string; newPassword: string },
  ) {
    return this.authService.updatePassword(req.user.id, data);
  }

  @Post("refresh")
  @ApiOperation({ summary: "Renovar access token usando refresh token" })
  @ApiResponse({ status: 200, description: "Tokens renovados exitosamente" })
  @ApiResponse({ status: 401, description: "Refresh token inválido" })
  async refresh(@Body() dto: RefreshTokenRequestDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }
}
