# AGENTS.md — Development Guidelines for NestJS + MikroORM Backends

This document defines the architectural standards, conventions, and best practices for AI agents and developers working on NestJS backends powered by MikroORM and Scalar API documentation.

---

## 1. Project Architecture & Domain-Driven Structure

The application follows a **Domain-Driven Modular Architecture**. Code must be organized by functional domains (features) rather than technical layers.

### Directory Structure

```text
src/
├── common/                     # Cross-cutting concerns
│   ├── decorators/             # Custom decorators (e.g., @CurrentUser, @Public, @Role)
│   ├── dto/                    # Global/Shared DTOs
│   ├── filters/                # Global exception filters
│   ├── guards/                 # Auth, Role, and Resource guards
│   ├── interceptors/           # Transform, logging, and response interceptors
│   └── utils/                  # Utility functions & helpers
├── config/                     # Configuration schemas & environment setups
│   ├── app.config.ts           # App environment configuration
│   └── database.config.ts      # MikroORM configuration
├── modules/                    # Feature modules (Domain-driven)
│   ├── auth/                   # Authentication & Session management
│   ├── users/                  # User management domain
│   ├── categories/             # Categories domain
│   ├── products/               # Products domain
│   ├── transactions/               # Transactions domain
├── app.module.ts               # Root application module
└── main.ts                     # Application bootstrap & Scalar API setup
```

---

## 2. MikroORM Entity Design (Modern v7+ Standards)

Entities represent data models and persist state. Use modern TypeScript syntax with explicit type safety.

### Principles:
1. **Use Explicit Primary Keys**: Prefer `UUID` or auto-incrementing `BigInt`/`number` based on domain needs.
2. **Type Safety with `Opt<T>` and `Rel<T>`**: Mark optional database default fields with `Opt<T>` to avoid required constructor properties. Use `Rel<T>` for relations when strict typing is needed.
3. **Cascades & Orphan Removal**: Explicitly define `cascade` and `orphanRemoval` behavior on relations.
4. **Soft Deletes & Timestamps**: Standardize soft delete fields (`deletedAt`) and filter defaults (`@Filter({ name: 'softDelete', cond: { deletedAt: null }, default: true })`).

### Entity Template Example (`usuario.entity.ts`):

```typescript
import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  OneToMany,
  Filter,
} from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import type { Opt, Rel } from '@mikro-orm/core';
import { Reserva } from '../../reservas/entities/reserva.entity.js';

export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENTE = 'CLIENTE',
}

@Entity({ tableName: 'usuarios' })
@Filter({
  name: 'softDelete',
  cond: { deletedAt: null },
  default: true,
})
export class Usuario {
  @PrimaryKey({ type: 'uuid' })
  id: string = crypto.randomUUID();

  @Property({ type: 'string', length: 120 })
  nombre!: string;

  @Property({ type: 'string', length: 255, unique: true })
  email!: string;

  @Property({ type: 'string', hidden: true })
  password!: string;

  @Enum({ items: () => UserRole, default: UserRole.CLIENTE })
  rol: Opt<UserRole> = UserRole.CLIENTE;

  @Property({ type: 'string', length: 500, nullable: true })
  foto_url?: string;

  @Property({ type: 'datetime', nullable: true, hidden: true })
  deletedAt?: Date | null = null;

  @OneToMany(() => Reserva, (reserva) => reserva.usuario)
  reservas = new Collection<Reserva>(this);
}
```

---

## 3. DTOs, Validation & Swagger CLI Plugin Introspection

DTOs (Data Transfer Objects) enforce contract isolation between network requests and domain logic.

### Rules for DTOs & Swagger Introspection:
- **Never expose raw entities directly in request bodies.**
- **Swagger CLI Plugin (`@nestjs/swagger`) Introspection**: The project uses `@nestjs/swagger` plugin configured in `nest-cli.json` (`"introspectComments": true`, `"classValidatorShim": true`).
- **DO NOT add manual `@ApiProperty()` or `@ApiPropertyOptional()` decorators to DTO fields.**
- Use standard JSDoc comments (`/** ... */`) and JSDoc `@example` tags directly on TypeScript class properties. NestJS compiler plugin introspects property types, optionality, class-validator rules, and JSDoc comments automatically to generate OpenAPI schemas.
- Use `class-validator` annotations (`@IsString()`, `@IsEmail()`, `@IsNotEmpty()`, etc.) for runtime validation.
- Global `ValidationPipe` is configured with `transform: true` and `whitelist: true`.

### DTO Example (`create-usuario.dto.ts`):

```typescript
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/usuario.entity.js';

export class CreateUsuarioDto {
  /**
   * Nombre completo del usuario
   * @example "Juan Pérez"
   */
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  /**
   * Correo electrónico único
   * @example "juan.perez@ejemplo.com"
   */
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  /**
   * Contraseña de acceso (mínimo 8 caracteres)
   * @example "Password123!"
   */
  @IsString()
  @MinLength(8)
  password!: string;

  /**
   * Rol asignado al usuario en el sistema
   * @example "CLIENTE"
   */
  @IsEnum(UserRole)
  @IsOptional()
  rol?: UserRole = UserRole.CLIENTE;
}
```

---

## 4. Services & Business Logic Layer

Services contain core business rules. They interact with entities through `SqlEntityManager` or feature repositories (`EntityRepository`).

### Guidelines:
1. **Atomic Transactions**: Use `em.transactional()` for operations modifying multiple entities.
2. **Explicit Errors**: Throw domain-specific HTTP exceptions (`ConflictException`, `NotFoundException`, `BadRequestException`).
3. **Domain Validation in Service**: Implement business checks (e.g., room capacity vs max class capacity) inside the service.

---

## 5. Controllers & OpenAPI / Scalar Documentation

Controllers handle HTTP routing, request extraction, response formatting, and API documentation.

### Requirements:
- Annotate every controller with `@ApiTags('NombreDelDominio')`.
- Document all routes with `@ApiOperation`, `@ApiResponse`, and authentication markers (`@ApiBearerAuth`).
- For `DELETE` endpoints, respond with `@HttpCode(HttpStatus.NO_CONTENT)` (HTTP 204) and a void return type.
- Mount **Scalar API Reference** over NestJS Swagger setup in `main.ts`.

---

## 6. Main Bootstrap & Scalar API Integration

Configure Swagger document builder and render **Scalar API Reference** for UI presentation.

---

## 7. Rules & Checklists for AI Code Generation Agents

When auto-generating code or extending modules in this repository, agents **MUST** follow these rules:

1. **Swagger Introspection over Decorators**: Do NOT import or add `@ApiProperty()` or `@ApiPropertyOptional()` to DTOs. Rely on JSDoc comments (`/** ... */`) and TS property types which are automatically introspected by NestJS Swagger CLI Plugin (`nest-cli.json`).
2. **Domain Isolation**: Never import code across domain boundaries directly from entity files unless establishing valid MikroORM relationships.
3. **Strict DTO Mapping**: Do not return raw ORM entities directly if sensitive properties could leak. Use response DTOs or `@Hidden()` decorator on sensitive fields (`password`).
4. **Validation Pipes**: Ensure every `CreateDto` / `UpdateDto` has `class-validator` annotations on **all** properties.
5. **Delete Operations**: Every DELETE route must return `HTTP 204 No Content` with an empty response body.
6. **Async/Await**: Never leave unhandled Floating Promises. Always `await` entity operations and `em.flush()`.
