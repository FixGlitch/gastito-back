# Gastito Backend 🇦🇷

API REST para gestión financiera personal argentina, construida con NestJS + PostgreSQL.

## Stack

- **Framework**: NestJS + TypeScript
- **ORM**: TypeORM + PostgreSQL
- **Auth**: JWT con Passport.js
- **Validación**: class-validator + class-transformer
- **Documentación**: @nestjs/swagger
- **Config**: @nestjs/config

## Estructura del proyecto

```
src/
├── main.ts                           # Entry point + Swagger setup
├── app.module.ts                     # Root module
├── common/
│   ├── enums/
│   │   └── expense-category.enum.ts  # Categorías de gasto (SUBE destacada)
│   ├── filters/
│   │   └── global-exception.filter.ts
│   ├── interceptors/
│   │   └── response.interceptor.ts    # Respuesta uniforme { data, meta, error }
│   └── interfaces/
│       └── response.interface.ts
├── database/
│   ├── data-source.ts                # TypeORM DataSource para migraciones
│   └── seed.ts                       # Seed con datos realistas argentinos
└── modules/
    ├── auth/                         # Autenticación JWT
    │   ├── dto/ (login, register)
    │   ├── guards/
    │   ├── strategies/
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   └── auth.module.ts
    ├── user/                         # Gestión de usuarios
    │   ├── entities/user.entity.ts
    │   ├── user.service.ts
    │   └── user.module.ts
    ├── expense/                      # CRUD de gastos
    │   ├── dto/expense.dto.ts
    │   ├── entities/expense.entity.ts
    │   ├── expense.controller.ts
    │   ├── expense.service.ts
    │   └── expense.module.ts
    ├── finance/                      # Presupuesto y distribución
    │   ├── dto/finance.dto.ts
    │   ├── entities/salary-profile.entity.ts
    │   ├── finance.controller.ts
    │   ├── finance.service.ts
    │   └── finance.module.ts
    ├── savings/                      # Metas de ahorro
    │   ├── dto/savings.dto.ts
    │   ├── entities/savings-goal.entity.ts
    │   ├── savings.controller.ts
    │   ├── savings.service.ts
    │   └── savings.module.ts
    └── dashboard/                    # Resumen y métricas
        ├── dashboard.controller.ts
        ├── dashboard.service.ts
        └── dashboard.module.ts
```

## Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Perfil del usuario |
| GET | `/api/expenses` | Listar gastos (filtros: category, month, search) |
| POST | `/api/expenses` | Crear gasto |
| GET | `/api/expenses/:id` | Obtener gasto |
| PUT | `/api/expenses/:id` | Actualizar gasto |
| DELETE | `/api/expenses/:id` | Eliminar gasto |
| GET | `/api/expenses/summary` | Resumen por categoría |
| GET | `/api/budget/summary` | Resumen del presupuesto |
| GET | `/api/budget/allocations` | Distribución por categoría |
| GET | `/api/budget/settings` | Configuración actual |
| PUT | `/api/budget/settings` | Actualizar configuración |
| POST | `/api/budget/inflation` | Aplicar ajuste inflación |
| GET | `/api/budget/alerts` | Alertas de presupuesto |
| GET | `/api/savings` | Listar metas de ahorro |
| POST | `/api/savings` | Crear meta de ahorro |
| PUT | `/api/savings/:id` | Actualizar meta |
| DELETE | `/api/savings/:id` | Eliminar meta |
| GET | `/api/dashboard/overview` | Resumen completo |
| GET | `/api/dashboard/comparison` | Comparación mensual |
| GET | `/api/dashboard/top-categories` | Top categorías |

## Setup en <5 minutos

### 1. Instalar PostgreSQL

Descargá e instalá PostgreSQL desde https://www.postgresql.org/download/

### 2. Crear la base de datos

```sql
CREATE DATABASE gastito_db;
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editá `.env` con tus credenciales de PostgreSQL.

### 4. Instalar dependencias

```bash
npm install
```

### 5. Ejecutar migraciones

```bash
npm run migration:run
```

### 6. Seed de datos (opcional)

```bash
npm run seed
```

Esto crea un usuario demo:
- **Email**: `demo@gastito.com`
- **Password**: `demo123456`
- **Sueldo**: $1.500.000/mes
- **Ahorro**: 20% ($300.000/mes)
- **20 gastos típicos argentinos** (SUBE, supermercado, servicios, etc.)

### 7. Ejecutar en desarrollo

```bash
npm run dev
```

La API estará en `http://localhost:3001`
Swagger docs en `http://localhost:3001/api/docs`

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Desarrollo con hot reload |
| `npm run build` | Build de producción |
| `npm run start` | Ejecutar build |
| `npm run seed` | Cargar datos de prueba |
| `npm run migration:generate -- -n nombre` | Generar migración |
| `npm run migration:run` | Ejecutar migraciones pendientes |
| `npm run migration:revert` | Revertir última migración |
| `npm run lint` | ESLint |
| `npm run test` | Tests unitarios |

## Contratos de respuesta

Todas las respuestas siguen un formato uniforme:

```json
{
  "data": { ... },
  "meta": { "page": 1, "total": 100 },
  "error": null
}
```

En caso de error:

```json
{
  "data": null,
  "meta": null,
  "error": "Mensaje de error descriptivo en español"
}
```

## Categorías de gasto

| Categoría | Clave | Color | Destacada |
|-----------|-------|-------|-----------|
| Alimentos | `alimentos` | #F59E0B | |
| Transporte | `transporte` | #8B5CF6 | |
| **SUBE** | `sube` | #2563EB | ✅ Sí |
| Servicios | `servicios` | #EF4444 | |
| Entretenimiento | `entretenimiento` | #EC4899 | |
| Salud | `salud` | #16A34A | |
| Educación | `educacion` | #0EA5E9 | |
| Hogar | `hogar` | #78716C | |
| Ropa | `ropa` | #A855F7 | |
| Otros | `otros` | #6B7280 | |

La categoría **SUBE** está destacada visualmente en todos los endpoints y tiene lógica de alerta especial cuando se excede el presupuesto asignado.

## Lógica financiera

### Distribución del presupuesto

El sueldo mensual se divide automáticamente:

1. **Ahorro**: porcentaje configurable (default 20%)
2. **Gastos**: el resto se distribuye por categoría:
   - Alimentos: 25%
   - Hogar: 15%
   - Servicios: 12%
   - Transporte: 8%
   - SUBE: 5%
   - Entretenimiento: 7%
   - Salud: 5%
   - Educación: 4%
   - Ropa: 4%
   - Otros: 15%

### Ajuste por inflación

El campo `inflationAdjustmentPercent` permite escalar el presupuesto al inicio de cada mes para compensar la inflación argentina.

### Alertas automáticas

- Presupuesto > 75% gastado: warning
- Presupuesto > 90% gastado: danger
- SUBE excedido: info
- Inflación aplicada: info
