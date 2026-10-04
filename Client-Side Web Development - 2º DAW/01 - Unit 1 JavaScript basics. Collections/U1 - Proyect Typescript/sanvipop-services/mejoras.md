# Propuestas de Mejora y Optimización del Proyecto (Enfoque Docente)

Este documento recopila las oportunidades de mejora, optimizaciones y buenas prácticas detectadas en el código del proyecto **Sanvipop Services**.

Al tratarse de un **proyecto formativo / de aprendizaje en docencia**, las propuestas están organizadas con un enfoque pedagógico: se prioriza la claridad conceptual, la adquisición de buenos hábitos profesionales y la comprensión de la arquitectura modular de **NestJS** y el ORM **MikroORM**, evitando sobreingenierías innecesarias pero corrigiendo prácticas que puedan inculcar malos hábitos en el alumnado.

---

## 1. Seguridad y Gestión de Secretos (Aspectos Críticos)

### 1.1. Almacenamiento de contraseñas en texto plano (Uso de `bcrypt`)
* **Situación actual**: En [`AuthService.registerUser`](file:///home/arturo/Documentos/Instituto/2026-2027/sanvipop-services/src/modules/auth/auth.service.ts#L37) y [`UsersService.updatePassword`](file:///home/arturo/Documentos/Instituto/2026-2027/sanvipop-services/src/modules/users/users.service.ts#L37), la contraseña se guarda tal cual en la columna `password` de SQLite. En el login, se busca coincidencia directa con texto plano.
* **Valor pedagógico**: Es una de las lecciones fundamentales en desarrollo web y ciberseguridad: **las contraseñas nunca deben almacenarse en texto plano**.
* **Propuesta de mejora**:
  1. Instalar `bcrypt` y `@types/bcrypt`.
  2. Crear un helper o método en `AuthService` para hashear con salt (ej. `await bcrypt.hash(password, 10)`).
  3. En el login, buscar al usuario solo por `email` y verificar con `await bcrypt.compare(password, user.password)`.

```typescript
// Ejemplo didáctico en AuthService:
const hashedPassword = await bcrypt.hash(userDto.password, 10);
// Y en login:
const user = await this.usersService.getUserbyEmail(userDto.email);
if (!user || !(await bcrypt.compare(userDto.password, user.password))) {
  throw new UnauthorizedException('Credenciales incorrectas');
}
```

---

### 1.2. Claves secretas hardcodeadas en código fuente (Uso de variables de entorno `.env`)
* **Situación actual**: En [`auth.module.ts`](file:///home/arturo/Documentos/Instituto/2026-2027/sanvipop-services/src/modules/auth/auth.module.ts#L27), el secreto del JWT está fijado en código: `'YTRnNk05TC4sLeG4iSorYXNkZg=='`.
* **Valor pedagógico**: Enseña el concepto del principio de "Twelve-Factor App" (configuración en el entorno) y el riesgo de exponer credenciales en repositorios Git.
* **Propuesta de mejora**:
  1. Crear un archivo `.env.example` con las variables requeridas (`JWT_SECRET`, `PORT`, `GOOGLE_ID`, `FIREBASE_CREDENTIALS`).
  2. Inyectar `ConfigService` en la configuración asíncrona de `JwtModule.registerAsync()`:

```typescript
JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.get<string>('JWT_SECRET', 'secreto_por_defecto_desarrollo'),
    signOptions: { expiresIn: '7d' },
  }),
})
```

---

### 1.3. Tiempo de expiración de tokens JWT
* **Situación actual**: En `auth.module.ts`, el token se emite con `{ expiresIn: '365d' }` (1 año).
* **Valor pedagógico**: Los tokens JWT son credenciales portadoras sin estado (*stateless*). Un tiempo de vida de 1 año imposibilita revocar accesos en caso de robo de credenciales.
* **Propuesta de mejora**:
  - Configurar un tiempo más prudente (ej. `1d` o `7d`).
  - Como contenido avanzado o práctica opcional, plantear la distinción entre `AccessToken` (corta duración, ej. 15m) y `RefreshToken`.

---

## 2. Lógica de Negocio y Modelado del Dominio

### 2.1. Eliminación de "números mágicos" en estados mediante enumeraciones (`enum`)
* **Situación actual**: En `Product.entity.ts`, el campo `status` es un número con valores arbitrarios en el código (`1` para disponible, `3` para vendido, etc.).
* **Valor pedagógico**: El uso de números mágicos perjudica la legibilidad, mantenibilidad y facilita errores tipográficos en el alumnado.
* **Propuesta de mejora**:
  Definir un enum tipado en la entidad y usarlo en DTOs y servicios:

```typescript
export enum ProductStatus {
  AVAILABLE = 1,
  RESERVED = 2,
  SOLD = 3,
}

// En Product entity:
@Enum({ items: () => ProductStatus, default: ProductStatus.AVAILABLE })
status: Opt<ProductStatus> = ProductStatus.AVAILABLE;
```

---

### 2.2. Validaciones en la compra de productos (`buyProduct`)
* **Situación actual**: En [`ProductsService.buyProduct`](file:///home/arturo/Documentos/Instituto/2026-2027/sanvipop-services/src/modules/products/products.service.ts#L232):
  1. Un usuario puede comprar su propio producto (no hay comprobación `product.owner.id === authUser.id`).
  2. Un usuario puede comprar un producto que ya tiene estado `3` (vendido).
* **Valor pedagógico**: Refuerza cómo las reglas de negocio críticas deben residir y protegerse en la capa de servicio, no solo en la interfaz gráfica.
* **Propuesta de mejora**:
  Añadir comprobaciones explícitas de negocio con excepciones HTTP adecuadas:

```typescript
if (product.owner.id === authUser.id) {
  throw new BadRequestException('No puedes comprar tu propio producto');
}
if (product.status === ProductStatus.SOLD) {
  throw new ConflictException('Este producto ya ha sido vendido');
}
```

---

### 2.3. Ciclo de vida de la transacción y valoraciones (`Transaction`)
* **Situación actual**: La entidad `Transaction` no se crea cuando un producto es comprado (`buyProduct`), sino de forma perezosa en [`TransactionsService.addRating`](file:///home/arturo/Documentos/Instituto/2026-2027/sanvipop-services/src/modules/transactions/transactions.service.ts#L50) solo si alguien envía una valoración.
* **Valor pedagógico**: Explicar la relación causal de eventos en un dominio: la *compra* es el evento que genera la transacción; la *valoración* es un atributo o consecuencia posterior de dicha transacción.
* **Propuesta de mejora**:
  1. Crear la instancia de `Transaction(product, buyer, seller)` en `buyProduct` dentro de una transacción atómica.
  2. En `addRating`, simplemente recuperar la transacción existente por el producto y registrar la valoración y comentario correspondientes.
  3. Prevenir valoraciones duplicadas (si el comprador ya valoró al vendedor, no permitir sobreescribir salvo que sea explícitamente una edición).

---

## 3. Calidad de Código y Manejo de Errores en NestJS

### 3.1. Filtro global de excepciones (`ExceptionFilter`)
* **Situación actual**: En [`AuthController`](file:///home/arturo/Documentos/Instituto/2026-2027/sanvipop-services/src/modules/auth/auth.controller.ts#L37) y [`UsersController`](file:///home/arturo/Documentos/Instituto/2026-2027/sanvipop-services/src/modules/users/users.controller.ts#L45) existen bloques `try/catch` que capturan manualmente excepciones del ORM (como errores de restricción única `UniqueConstraintViolationException`) y lanzan `BadRequestException` o `ConflictException`.
* **Valor pedagógico**: NestJS ofrece filtros de excepción (`@Catch()`) para desacoplar el tratamiento de errores de base de datos de los controladores, manteniendo estos últimos limpios y declarativos.
* **Propuesta de mejora**:
  Crear un filtro en `src/common/filters/database-exception.filter.ts` que capture excepciones de MikroORM y las traduzca a respuestas HTTP semánticas:

```typescript
@Catch(UniqueConstraintViolationException)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: UniqueConstraintViolationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(HttpStatus.CONFLICT).json({
      statusCode: HttpStatus.CONFLICT,
      message: 'El registro ya existe (valor duplicado)',
    });
  }
}
```

---

### 3.2. Transaccionalidad Atómica (`em.transactional()`)
* **Situación actual**: En métodos como `ProductsService.create`, se realizan operaciones secuenciales con múltiples llamadas a `persist()` y `flush()`. Si una de las operaciones intermedias falla, los datos pueden quedar en un estado inconsistente.
* **Valor pedagógico**: Comprensión práctica de las propiedades ACID y cómo rollbackear operaciones dependientes de manera automática.
* **Propuesta de mejora**:
  Envolver operaciones que involucren más de una entidad en `this.em.transactional(async (em) => { ... })`.

---

## 4. Validación y Robustez en los DTOs

### 4.1. Validaciones de rango y longitud en DTOs
* **Situación actual**:
  - `InsertProductDto.price`: solo tiene `@IsNumber()`. Permite precios negativos o 0€.
  - `InsertProductDto.title`: no tiene `@MaxLength(250)` ni `@MinLength(3)`, a pesar de que la base de datos define `length: 250`.
  - `RegisterUserDto.lat` / `lng`: no valida rangos de coordenadas (-90 a 90, -180 a 180).
* **Valor pedagógico**: Destacar la importancia de la validación en la puerta de entrada (Fail Early) para evitar que datos corruptos lleguen a la base de datos o causen fallos no controlados.
* **Propuesta de mejora**:
  - Usar `@IsPositive()` o `@Min(0.01)` para campos monetarios.
  - Usar `@Length(3, 250)` en títulos y textos con límites definidos.
  - Usar `@IsLatitude()` y `@IsLongitude()` de `class-validator` para coordenadas geográficas.

---

### 4.2. Documentación JSDoc y ejemplos en DTOs (para Swagger/Scalar)
* **Situación actual**: Varios DTOs (`InsertProductDto`, `EditProductDto`, `AddPhotoDto`) carecen de comentarios JSDoc y etiquetas `@example`.
* **Valor pedagógico**: El proyecto utiliza el plugin de Swagger para introspección automática. Documentar DTOs con JSDoc permite a los alumnos entender cómo generar documentación interactiva OpenAPI/Scalar rica y profesional sin ensuciar el código con decoradores repetitivos.

```typescript
export class InsertProductDto {
  /**
   * Título descriptivo del producto
   * @example "Bicicleta de montaña 29 pulgadas"
   */
  @IsString()
  @Length(3, 250)
  title!: string;

  /**
   * Precio de venta en euros
   * @example 150.50
   */
  @IsNumber()
  @IsPositive()
  price!: number;
}
```

---

## 5. Gestión de Archivos e Imágenes

### 5.1. Nombres de archivo colisionables y uso de `crypto.randomUUID()`
* **Situación actual**: En [`ImageService`](file:///home/arturo/Documentos/Instituto/2026-2027/sanvipop-services/src/common/services/image/image.service.ts#L10), los nombres de archivo se generan con `Date.now() + '.jpg'`. Si dos imágenes se suben en el mismo milisegundo (o en un bucle/subida masiva), una sobrescribe a la otra.
* **Valor pedagógico**: Enseñar técnicas seguras de generación de identificadores únicos (UUID v4) y prevenir colisiones.
* **Propuesta de mejora**:
  ```typescript
  import { randomUUID } from 'crypto';
  const fileName = `${Date.now()}-${randomUUID()}.jpg`;
  ```

---

### 5.2. Modernización a `fs/promises`
* **Situación actual**: `ImageService` utiliza `fs.writeFile` y `fs.unlink` tradicionales basados en *callbacks*, envueltos manualmente en `new Promise((resolve, reject) => ...)`.
* **Valor pedagógico**: Mostrar al alumnado el uso moderno de `fs/promises` con `async/await`, mucho más limpio y estándar en TypeScript actual.
* **Propuesta de mejora**:
  ```typescript
  import * as fs from 'fs/promises';

  async saveImage(dir: string, photoBase64: string): Promise<string> {
    const data = photoBase64.split(',')[1] || photoBase64;
    const fileName = `${Date.now()}-${randomUUID()}.jpg`;
    const filePath = path.join('img', dir, fileName);
    await fs.writeFile(filePath, Buffer.from(data, 'base64'));
    return `img/${dir}/${fileName}`;
  }
  ```

---

### 5.3. Limpieza de imágenes huérfanas al borrar productos
* **Situación actual**: Cuando se ejecuta `ProductsService.delete(id)` o `removePhoto(id)`, se elimina el registro en la base de datos, pero el archivo físico en la carpeta `img/products/` nunca se borra.
* **Valor pedagógico**: Gestión del ciclo de vida de recursos externos. Borrar solo en la base de datos provoca "fuga de almacenamiento" en disco.
* **Propuesta de mejora**:
  Llamar a `this.imageService.removeImage(photo.url)` antes o después del `em.flush()` para eliminar físicamente las imágenes asociadas.

---

## 6. Rendimiento y Consultas en la Base de Datos

### 6.1. Paginación en listados de productos (`limit` y `offset`)
* **Situación actual**: Los endpoints de consulta (`GET /products`, `GET /products/mine`, etc.) devuelven todos los registros existentes de una sola vez.
* **Valor pedagógico**: La paginación es un patrón imprescindible en cualquier API REST para evitar degradación de rendimiento y consumo excesivo de memoria conforme crece el volumen de datos.
* **Propuesta de mejora**:
  Crear un DTO reutilizable `PaginationDto` con `page` y `limit` (con valores por defecto `page=1`, `limit=20`) y aplicarlo en el QueryBuilder de `ProductsRepository`.

---

### 6.2. Optimización de métodos de verificación (`count` vs `findOne`)
* **Situación actual**: En [`UsersService.emailExists`](file:///home/arturo/Documentos/Instituto/2026-2027/sanvipop-services/src/modules/users/users.service.ts#L29):
  ```typescript
  async emailExists(email: string): Promise<boolean> {
    return (await this.usersRepo.findOne({ email })) ? true : false;
  }
  ```
* **Valor pedagógico**: Diferencia entre traer una fila completa con todas sus columnas a memoria vs ejecutar un `COUNT(1)` a nivel de motor de base de datos.
* **Propuesta de mejora**:
  ```typescript
  async emailExists(email: string): Promise<boolean> {
    return (await this.usersRepo.count({ email })) > 0;
  }
  ```

---

## 7. Pruebas Unitarias y Experiencia del Alumnado

### 7.1. Pruebas unitarias de comportamiento en lugar de "smoke tests"
* **Situación actual**: La mayoría de las pruebas `*.spec.ts` actuales solo evalúan `expect(service).toBeDefined()` o `expect(controller).toBeDefined()`.
* **Valor pedagógico**: Los alumnos aprenden poco viendo solo pruebas de instanciación. Enseñar a simular dependencias (*mocking*) y comprobar casos de uso reales (ej. "debe lanzar ForbiddenException si el usuario no es el dueño") les da herramientas prácticas para el mundo laboral.
* **Propuesta de mejora**:
  Añadir 2-3 pruebas representativas en un servicio clave (como `ProductsService` o `AuthService`) que muestren cómo testear:
  1. Caso de éxito con retorno esperado.
  2. Caso de error esperado (ej. `NotFoundException`).
  3. Verificación de llamadas al repositorio (`expect(mockRepo.persist).toHaveBeenCalled()`).

---

### 7.2. Semillas de datos iniciales (*Seeders*)
* **Situación actual**: La base de datos `sanvipop.db` arranca completamente vacía. Para probar la app, el alumno debe crear categorías manualmente o registrar usuarios desde cero.
* **Valor pedagógico**: Facilita el inicio rápido (*Onboarding*) de los estudiantes y enseña el uso de *seeders* y *fixtures* en desarrollo.
* **Propuesta de mejora**:
  Aprovechar `@mikro-orm/seeder` para crear un `DatabaseSeeder` que inserte las 8-10 categorías habituales (Informática, Deporte, Ropa, Hogar...) y un par de usuarios de prueba con productos de ejemplo.

---

## Matriz Resumen de Prioridad Pedagógica

| Prioridad | Área | Mejora Propuesta | Dificultad para el Alumno |
| :--- | :--- | :--- | :--- |
| **Alta** | Seguridad | Hashear contraseñas con `bcrypt` | Fácil |
| **Alta** | Seguridad | Mover secretos JWT a variables de entorno (`.env.example`) | Fácil |
| **Alta** | Dominio | Reemplazar números mágicos por `enum ProductStatus` | Fácil |
| **Media** | Negocio | Validar que no puedas comprar tu propio producto ni un producto vendido | Fácil |
| **Media** | Validación | Validar precios positivos y límites de longitud en DTOs | Fácil |
| **Media** | Infraestructura | Modernizar `ImageService` a `fs/promises` y nombres UUID | Media |
| **Media** | Arquitectura | Filtro global de excepciones para errores de base de datos | Media |
| **Baja / Opcional** | Rendimiento | Paginación en listados de productos | Media |
| **Baja / Opcional** | Testing | Tests unitarios con mocks de casos límite en servicios | Media |
| **Baja / Opcional** | DX | Seeder de categorías y datos de prueba iniciales | Fácil |

