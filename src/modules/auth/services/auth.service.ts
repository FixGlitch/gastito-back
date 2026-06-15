import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { UserService } from "../../user/services/user.service";
import { RegisterRequestDto } from "../dto/request/register.request";
import { LoginRequestDto } from "../dto/request/login.request";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterRequestDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException("Ya existe una cuenta con ese correo electrónico");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });

    const tokens = this.generateTokens(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
      tokens,
    };
  }

  async login(dto: LoginRequestDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const tokens = this.generateTokens(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
      tokens,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException("Usuario no encontrado");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: string, data: { name?: string; email?: string; avatarUrl?: string }) {
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException("Usuario no encontrado");

    if (data.email && data.email !== user.email) {
      const existing = await this.userService.findByEmail(data.email);
      if (existing) throw new ConflictException("Ya existe una cuenta con ese correo");
    }

    await this.userService.update(userId, data);
    return this.getProfile(userId);
  }

  async updatePassword(userId: string, data: { currentPassword: string; newPassword: string }) {
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException("Usuario no encontrado");

    const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isPasswordValid) throw new UnauthorizedException("Contraseña actual incorrecta");

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this.userService.update(userId, { password: hashedPassword });
    return { message: "Contraseña actualizada exitosamente" };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get("JWT_REFRESH_SECRET", "gastito-refresh-secret-change"),
      });

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException("Usuario no encontrado");
      }

      const tokens = this.generateTokens(user);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException("Refresh token inválido o expirado");
    }
  }

  private generateTokens(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get("JWT_SECRET"),
        expiresIn: this.configService.get("JWT_EXPIRES_IN", "24h"),
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
        expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN", "7d"),
      }),
    };
  }
}
