import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./modules/auth/auth.module";
import { ExpenseModule } from "./modules/expense/expense.module";
import { SavingsModule } from "./modules/savings/savings.module";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { AllExceptionsFilter } from "./common/filters/global-exception.filter";
import { CustomThrottlerGuard } from "./common/guards/custom-throttler.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
        PORT: Joi.number().default(3000),
        FRONTEND_URL: Joi.string().default("http://localhost:3001"),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        THROTTLE_TTL: Joi.number().default(60),
        THROTTLE_LIMIT: Joi.number().default(100),
      }),
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get("DB_HOST"),
        port: config.get<number>("DB_PORT"),
        username: config.get("DB_USERNAME"),
        password: config.get("DB_PASSWORD"),
        database: config.get("DB_DATABASE"),
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: true,
        logging: config.get<boolean>("DB_LOGGING", false),
        migrations: ["dist/migrations/*.js"],
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>("THROTTLE_TTL", 60) * 1000,
            limit: config.get<number>("THROTTLE_LIMIT", 100),
          },
        ],
      }),
    }),
    AuthModule,
    ExpenseModule,
    SavingsModule,
  ],
  providers: [
    {
      provide: "APP_INTERCEPTOR",
      useClass: ResponseInterceptor,
    },
    {
      provide: "APP_FILTER",
      useClass: AllExceptionsFilter,
    },
    {
      provide: "APP_GUARD",
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
