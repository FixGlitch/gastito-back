import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { SavingsService } from "../services/savings.service";
import { CreateSavingsGoalRequestDto, UpdateSavingsGoalRequestDto } from "../dto/request/savings.request";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

@ApiTags("savings")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller("savings")
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Get()
  @ApiOperation({ summary: "Listar metas de ahorro" })
  async findAll(@Req() req: { user: { id: string } }) {
    return this.savingsService.findAll(req.user.id);
  }

  @Get("projection")
  @ApiOperation({ summary: "Proyección de ahorro" })
  async getProjection(
    @Req() req: { user: { id: string } },
    @Query("monthly") monthlySavings: string,
  ) {
    const amount = parseFloat(monthlySavings) || 0;
    return this.savingsService.getProjection(req.user.id, amount);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener meta de ahorro por ID" })
  async findOne(@Req() req: { user: { id: string } }, @Param("id") id: string) {
    return this.savingsService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: "Crear meta de ahorro" })
  async create(
    @Req() req: { user: { id: string } },
    @Body() dto: CreateSavingsGoalRequestDto,
  ) {
    return this.savingsService.create(req.user.id, dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Actualizar parcialmente meta de ahorro" })
  async update(
    @Req() req: { user: { id: string } },
    @Param("id") id: string,
    @Body() dto: UpdateSavingsGoalRequestDto,
  ) {
    return this.savingsService.update(id, req.user.id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar lógicamente meta de ahorro" })
  async remove(@Req() req: { user: { id: string } }, @Param("id") id: string) {
    await this.savingsService.remove(id, req.user.id);
    return { message: "Meta de ahorro eliminada correctamente" };
  }
}
