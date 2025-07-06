import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type AppConfigTypes = {
  NODE_ENV: string;
  API_NAME: string;
  API_DOCS: number;
  API_SEED: number;
  API_PORT: number;
  DB_TYPE: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASS: string;
  DB_NAME: string;
  LOG_LEVEL: string;
  LOKI_URL: string;
  LOKI_USER: string;
  LOKI_PASS: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CRYPTO_SECRET: string;
};

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService<AppConfigTypes>) {}

  get NODE_ENV(): string {
    return this.configService.getOrThrow('NODE_ENV', { infer: true });
  }

  get API_NAME(): string {
    return this.configService.getOrThrow('API_NAME', { infer: true });
  }

  get API_DOCS(): number {
    return Number(this.configService.getOrThrow('API_DOCS', { infer: true }));
  }

  get API_SEED(): number {
    return Number(this.configService.getOrThrow('API_SEED', { infer: true }));
  }

  get API_PORT(): number {
    return Number(this.configService.getOrThrow('API_PORT', { infer: true }));
  }

  get DB_TYPE(): string {
    return this.configService.getOrThrow('DB_TYPE', { infer: true });
  }

  get DB_HOST(): string {
    return this.configService.getOrThrow('DB_HOST', { infer: true });
  }

  get DB_PORT(): number {
    return Number(this.configService.getOrThrow('DB_PORT', { infer: true }));
  }

  get DB_USER(): string {
    return this.configService.getOrThrow('DB_USER', { infer: true });
  }

  get DB_PASS(): string {
    return this.configService.getOrThrow('DB_PASS', { infer: true });
  }

  get DB_NAME(): string {
    return this.configService.getOrThrow('DB_NAME', { infer: true });
  }

  get LOG_LEVEL(): string {
    return this.configService.getOrThrow('LOG_LEVEL', { infer: true });
  }

  get LOKI_URL(): string {
    return this.configService.getOrThrow('LOKI_URL', { infer: true });
  }

  get LOKI_USER(): string {
    return this.configService.getOrThrow('LOKI_USER', { infer: true });
  }

  get LOKI_PASS(): string {
    return this.configService.getOrThrow('LOKI_PASS', { infer: true });
  }

  get JWT_SECRET(): string {
    return this.configService.getOrThrow('JWT_SECRET', { infer: true });
  }

  get JWT_EXPIRES_IN(): string {
    return this.configService.getOrThrow('JWT_EXPIRES_IN', { infer: true });
  }

  get CRYPTO_SECRET(): string {
    return this.configService.getOrThrow('CRYPTO_SECRET', { infer: true });
  }
}
