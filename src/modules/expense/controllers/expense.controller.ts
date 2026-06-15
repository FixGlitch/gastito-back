import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ExpenseService } from "../services/expense.service";
import { CreateExpenseRequestDto, UpdateExpenseRequestDto, ExpenseFiltersRequestDto } from "../dto/request/expense.request";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

@ApiTags("expenses")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller("expenses")
export class ExpenseController {
  constructor(
    private readonly expenseService: ExpenseService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Listar gastos del usuario" })
  async findAll(
    @Req() req: { user: { id: string } },
    @Query() filters?: ExpenseFiltersRequestDto,
  ) {
    return this.expenseService.findAll(req.user.id, filters);
  }

  @Get("summary")
  @ApiOperation({ summary: "Resumen de gastos por categoría" })
  async getSummary(
    @Req() req: { user: { id: string } },
    @Query("month") month?: string,
  ) {
    return this.expenseService.getSummary(req.user.id, month);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un gasto por ID" })
  async findOne(@Req() req: { user: { id: string } }, @Param("id") id: string) {
    return this.expenseService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: "Crear un nuevo gasto" })
  async create(
    @Req() req: { user: { id: string } },
    @Body() dto: CreateExpenseRequestDto,
  ) {
    return this.expenseService.create(req.user.id, dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Actualizar un gasto" })
  async update(
    @Req() req: { user: { id: string } },
    @Param("id") id: string,
    @Body() dto: UpdateExpenseRequestDto,
  ) {
    return this.expenseService.update(id, req.user.id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar un gasto" })
  async remove(@Req() req: { user: { id: string } }, @Param("id") id: string) {
    await this.expenseService.remove(id, req.user.id);
    return { message: "Gasto eliminado correctamente" };
  }
}
