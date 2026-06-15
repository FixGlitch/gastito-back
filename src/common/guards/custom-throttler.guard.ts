import { Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import { ExecutionContext } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    const user = (req as any).user;
    if (user && user.id) {
      return user.id;
    }
    return req.ip || "unknown";
  }
}
