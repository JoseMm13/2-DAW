<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

- [Servicios web aplicación SanviPop](#servicios-web-aplicación-sanvipop)
  - [Instalación y puesta en marcha](#instalación-y-puesta-en-marcha)
  - [Configuración del Entorno (.env)](#configuración-del-entorno-env)
  - [Gestión de la Base de Datos y Semilla Inicial](#gestión-de-la-base-de-datos-y-semilla-inicial)
    - [Datos generados por el Seed (`npm run db:seed`)](#datos-generados-por-el-seed-npm-run-dbseed)
  - [Documentación Interactiva (Scalar / Swagger)](#documentación-interactiva-scalar--swagger)
  - [Configurando notificaciones Push](#configurando-notificaciones-push)
  - [Ejecución y Pruebas](#ejecución-y-pruebas)
- [Servicios web - Colecciones](#servicios-web---colecciones)
  - [Colección /auth](#colección-auth)
    - [**POST /auth/login**](#post-authlogin)
    - [**POST /auth/google**](#post-authgoogle)
    - [**POST /auth/facebook**](#post-authfacebook)
    - [**POST /auth/register**](#post-authregister)
    - [**GET /auth/validate**](#get-authvalidate)
  - [Colección /categories](#colección-categories)
    - [**GET /categories** (Público)](#get-categories-público)
  - [Colección /products](#colección-products)
    - [**GET /products** (catálogo general con paginación y ordenación)](#get-products-catálogo-general-con-paginación-y-ordenación)
    - [**GET /products/bookmarks** (productos favoritos con paginación, ordenación y búsqueda)](#get-productsbookmarks-productos-favoritos-con-paginación-ordenación-y-búsqueda)
    - [**GET /products/user** (productos de usuario con filtros, paginación y ordenación)](#get-productsuser-productos-de-usuario-con-filtros-paginación-y-ordenación)
    - [**GET /products/:id**](#get-productsid)
    - [**POST /products**](#post-products)
    - [**PUT /products/:id**](#put-productsid)
    - [**PUT /products/:id/buy**](#put-productsidbuy)
    - [**DELETE /products/:id**](#delete-productsid)
    - [**POST /products/:id/bookmarks**](#post-productsidbookmarks)
    - [**DELETE /products/:id/bookmarks**](#delete-productsidbookmarks)
    - [**POST /products/:id/photos**](#post-productsidphotos)
    - [**DELETE /products/:idProd/photos/:idPhoto**](#delete-productsidprodphotosidphoto)
  - [Colección /users](#colección-users)
    - [**GET /users/me**](#get-usersme)
    - [**GET /users/:id**](#get-usersid)
    - [**GET /users/name/:name**](#get-usersnamename)
    - [**PUT /users/me**](#put-usersme)
    - [**PUT /users/me/photo**](#put-usersmephoto)
    - [**PUT /users/me/password**](#put-usersmepassword)
  - [Colección /ratings](#colección-ratings)
    - [**POST /ratings**](#post-ratings)
    - [**GET /ratings/user/me**](#get-ratingsuserme)
    - [**GET /ratings/user/:idUser**](#get-ratingsuseriduser)

---

# Servicios web aplicación SanviPop

Servicios web REST construidos con **NestJS 12** y **MikroORM 7** para los proyectos de la asignatura de desarrollo en entorno cliente.

## Instalación y puesta en marcha

El proyecto utiliza **SQLite** (`sanvipop.db`), por lo que no es necesario instalar ni configurar servidores de bases de datos externos (MariaDB/MySQL). El archivo de base de datos se genera automáticamente y la aplicación siembra las categorías por defecto en el primer inicio.

1. Instalar las dependencias:

```bash
$ npm install
```

2. Crear el archivo de variables de entorno `.env` a partir de la plantilla:

```bash
$ cp .env.example .env
```

## Configuración del Entorno (.env)

El archivo `.env` contiene las opciones de configuración de la aplicación:

```env
PORT=3000
BASE_PATH=
JWT_SECRET=super_secret_jwt_key_sanvipop_educational_2026
JWT_EXPIRES_IN=7d
GOOGLE_ID=your_google_client_id_here
DB_NAME=sanvipop.db
```

- **PORT**: Puerto en el que escuchará el servidor (por defecto 3000).
- **JWT_SECRET**: Clave secreta para firmar los tokens JWT.
- **JWT_EXPIRES_IN**: Tiempo de expiración del token (configurado a **7 días**: `7d`).
- **GOOGLE_ID**: Identificador del cliente de Google para validar inicios de sesión con OAuth2.
- **DB_NAME**: Ruta/nombre del archivo SQLite (`sanvipop.db`).

## Gestión de la Base de Datos y Semilla Inicial

El proyecto incluye scripts configurados en `package.json` para gestionar el ciclo de vida de la base de datos y su esquema mediante el CLI de **MikroORM**:

```bash
# Eliminar todas las tablas del esquema
$ npm run db:drop

# Crear las tablas a partir de las entidades
$ npm run db:create

# Actualizar el esquema si se modifican las entidades
$ npm run db:update

# Poblar la base de datos con datos de prueba iniciales
$ npm run db:seed
```

### Datos generados por el Seed (`npm run db:seed`)
- **8 Categorías oficiales:** Informática, Telefonía, Hogar, Deportes, Motor, Moda, Juegos, Otros.
- **3 Usuarios de prueba** (contraseña de todos: `Password123!`):
  - `arturo@sanvipop.es` (San Vicente del Raspeig)
  - `maria@sanvipop.es` (Alicante)
  - `carlos@sanvipop.es` (San Vicente Centro)
- **8 Productos de prueba:** Catálogo variado en distintas categorías, con estados disponibles (`AVAILABLE`) y vendidos (`SOLD`), fotografías asociadas y asignación de `mainPhoto`.
- **1 Favorito:** El usuario Arturo tiene en favoritos la bicicleta de montaña de María.
- **1 Transacción completada:** Producto vendido de Carlos a Arturo con calificaciones (5 estrellas) y comentarios de ambas partes.

## Documentación Interactiva (Scalar / Swagger)

El servidor incluye interfaces interactivas para explorar y probar todos los endpoints directamente desde el navegador:

- **Scalar API Reference**: [http://localhost:3000/reference](http://localhost:3000/reference) (Recomendada, interfaz moderna)
- **Swagger UI / OpenAPI**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Configurando notificaciones Push

Descarga el archivo de cuenta de servicio de Firebase (en *Configuración de proyecto -> Cuentas de servicio*) y colócalo dentro de la carpeta **firebase** con el nombre **serviceAccountKey.json**. Debe pertenecer al mismo proyecto de Firebase configurado en la app cliente. Los servicios envían notificaciones push automáticas cuando un usuario compra un producto o cuando recibe una valoración en una transacción.

## Ejecución y Pruebas

```bash
# Modo desarrollo con recarga automática
$ npm run start:dev

# Ejecutar pruebas unitarias (Vitest)
$ npm test

# Ejecutar pruebas end-to-end
$ npm run test:e2e

# Compilar para producción
$ npm run build
```

---

# Servicios web - Colecciones

- Todos los endpoints que retornan datos lo hacen en formato **JSON**.
- Cuando ocurre un error, se devuelve el código de estado HTTP correspondiente acompañado de un objeto JSON describiendo el fallo.
- Salvo que se indique explícitamente lo contrario (como `GET /categories` y las rutas de autenticación), **todas las peticiones requieren un token JWT** en la cabecera `Authorization`:

```http
Authorization: Bearer <auth_token>
```

Si no se incluye o el token es inválido/ha expirado, el servidor responderá con un código **401 Unauthorized**.

---

## Colección /auth

### **POST /auth/login**

Comprueba las credenciales del usuario (las contraseñas se validan de forma segura con **bcrypt**). Si son correctas, devuelve un token de autenticación JWT válido durante **7 días**. Opcionalmente se puede enviar la posición geográfica del usuario y su token de Firebase para actualizar sus datos.

**Petición (`application/json`):**

```json
{
  "email": "prueba@email.es",
  "password": "Password123!",
  "lat": 38.4018,
  "lng": -0.5241,
  "firebaseToken": "fcm_optional_token"
}
```

*Parámetros:*
- `email` (string, obligatorio): Correo registrado.
- `password` (string, obligatorio): Contraseña del usuario.
- `lat` (número, opcional): Latitud (-90 a 90).
- `lng` (número, opcional): Longitud (-180 a 180).
- `firebaseToken` (string, opcional): Token FCM para notificaciones push.

**Respuesta exitosa (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores posibles:**
- **401 Unauthorized**: Si el email o la contraseña son incorrectos.

---

### **POST /auth/google**

Valida un `id_token` obtenido mediante el SDK cliente de Google. Si el usuario ya existe en la base de datos, funciona como inicio de sesión. Si no existe, lo registra automáticamente con los datos facilitados por Google.

**Petición (`application/json`):**

```json
{
  "token": "google_id_token_del_cliente",
  "lat": 38.4018,
  "lng": -0.5241,
  "firebaseToken": "fcm_optional_token"
}
```

**Respuesta exitosa (200 OK):** Devuelve el `accessToken` (igual que `/auth/login`).

---

### **POST /auth/facebook**

Valida el `accessToken` de Facebook recibido desde la aplicación cliente. Funciona de manera idéntica a `/auth/google`: inicia sesión si el usuario existe o lo registra si es nuevo.

**Petición (`application/json`):**

```json
{
  "token": "facebook_access_token_del_cliente",
  "lat": 38.4018,
  "lng": -0.5241,
  "firebaseToken": "fcm_optional_token"
}
```

**Respuesta exitosa (200 OK):** Devuelve el `accessToken`.

---

### **POST /auth/register**

Registra un nuevo usuario en el sistema. La contraseña se almacena con un hash seguro con salt (**bcrypt**), y la imagen de perfil se procesa y guarda físicamente en el servidor con un nombre único basado en UUID.

**Petición (`application/json`):**

```json
{
  "name": "Juan Pérez",
  "email": "juan.perez@correo.es",
  "password": "Password123!",
  "photo": "data:image/jpeg;base64,...",
  "lat": 38.4018,
  "lng": -0.5241,
  "firebaseToken": "fcm_token_opcional"
}
```

*Restricciones de validación:*
- `name`: Entre 3 y 120 caracteres.
- `email`: Formato email válido y único en el sistema.
- `password`: Mínimo 4 caracteres.
- `photo`: Cadena en Base64 con la imagen de perfil.
- `lat`: Entre -90 y 90 (opcional).
- `lng`: Entre -180 y 180 (opcional).

**Respuesta exitosa (201 Created):**

```json
{
  "email": "juan.perez@correo.es"
}
```

**Errores posibles:**
- **400 Bad Request**: Parámetros faltantes o que no cumplen las restricciones de validación.
- **409 Conflict**: Si el correo electrónico ya se encuentra registrado en el sistema.

---

### **GET /auth/validate**

Verifica la validez del token JWT proporcionado en la cabecera `Authorization`.

**Cabecera:**
```http
Authorization: Bearer <auth_token>
```

**Respuesta exitosa (204 No Content):** Cuerpo vacío. El token es válido y no ha expirado.  
**Error (401 Unauthorized):** Si el token no se incluye, es inválido o ha expirado.

---

## Colección /categories

### **GET /categories** (Público)

> **Nota:** Este endpoint es **público** y **NO requiere** cabecera de autenticación.

Devuelve todas las categorías de productos disponibles en la base de datos.

**Respuesta exitosa (200 OK):**

```json
{
  "categories": [
    { "id": 1, "name": "Informática" },
    { "id": 2, "name": "Telefonía" },
    { "id": 3, "name": "Hogar" },
    { "id": 4, "name": "Deportes" },
    { "id": 5, "name": "Motor" },
    { "id": 6, "name": "Moda" },
    { "id": 7, "name": "Juegos" },
    { "id": 8, "name": "Otros" }
  ]
}
```

---

## Colección /products

Todos los servicios de esta colección requieren cabecera `Authorization: Bearer <auth_token>`.

### **GET /products** (catálogo general con paginación y ordenación)

Devuelve los productos disponibles (`status` distinto de 3 / no vendidos) ordenados de forma ascendente según el criterio indicado (por defecto por distancia calculada mediante la fórmula de Haversine respecto a la posición del usuario autenticado). Permite filtrar por texto en el título o descripción. Siempre se devuelven 12 resultados por página.

**Parámetros de consulta (Query params, opcionales):**
- `search` (cadena, opcional): Cadena de texto para filtrar productos cuyo título o descripción contenga dicho término.
- `page` (número, opcional): Número de página para la paginación (>= 1, por defecto 1).
- `sort` (cadena, opcional): Criterio de ordenación ascendente. Valores posibles:
  - `distance` (por defecto): De menor a mayor distancia.
  - `price`: De menor a mayor precio.
  - `views`: De menor a mayor número de visitas (`numVisits`).

*Ejemplos de peticiones:*
- Página 1 por distancia: `GET /products`
- Filtrar por término de búsqueda: `GET /products?search=bici`
- Página 2 por distancia: `GET /products?page=2`
- Ordenados por precio más bajo: `GET /products?sort=price`
- Ordenados por menos visitas: `GET /products?sort=views`
- Página 3 ordenados por precio buscando "bici": `GET /products?search=bici&page=3&sort=price`

**Respuesta exitosa (200 OK):**

```json
{
  "products": [
    {
      "id": 1,
      "title": "Bicicleta de montaña",
      "description": "Bicicleta en perfecto estado, poco uso.",
      "price": 150.5,
      "status": 1,
      "datePublished": "2026-03-15T10:00:00.000Z",
      "numVisits": 12,
      "category": {
        "id": 4,
        "name": "Deportes"
      },
      "owner": {
        "id": 2,
        "name": "María Gómez",
        "email": "maria@correo.es",
        "lat": 38.39,
        "lng": -0.51,
        "photo": "http://localhost:3000/img/users/1741818000-uuid.jpg"
      },
      "mainPhoto": "http://localhost:3000/img/products/1741818100-uuid.jpg",
      "distance": 1.45,
      "bookmarked": false,
      "mine": false
    }
  ],
  "page": 1,
  "total_pages": 1,
  "total_products": 7
}
```

---

### **GET /products/bookmarks** (productos favoritos con paginación, ordenación y búsqueda)

Devuelve los productos guardados en favoritos por el usuario autenticado, con paginación fija de 12 elementos por página, ordenación ascendente configurable y búsqueda por texto.

**Parámetros de consulta (Query params, opcionales):**
- `page` (número, opcional): Número de página para la paginación (>= 1, por defecto 1). Siempre se devuelven 12 resultados.
- `sort` (cadena, opcional): Criterio de ordenación ascendente (`distance` [por defecto], `price`, `views`).
- `search` (cadena, opcional): Cadena de texto para filtrar productos favoritos cuyo título o descripción contenga dicho término.

*Ejemplos de peticiones:*
- Mis favoritos (página 1 por defecto): `GET /products/bookmarks`
- Mis favoritos en página 2: `GET /products/bookmarks?page=2`
- Mis favoritos ordenados por precio: `GET /products/bookmarks?sort=price`
- Buscar en mis favoritos: `GET /products/bookmarks?search=bici`

**Respuesta exitosa (200 OK):** `{ "products": [ ... ], "page": 1, "total_pages": 1, "total_products": 2 }`

---

### **GET /products/user** (productos de usuario con filtros, paginación y ordenación)

Devuelve los productos relacionados con un usuario (por defecto el usuario autenticado), filtrados según su estado (`selling`, `sold` o `bought`), con paginación fija de 12 elementos, ordenación ascendente configurable y filtro por texto en título o descripción.

**Parámetros de consulta (Query params, opcionales):**
- `search` (cadena, opcional): Cadena de texto para filtrar productos cuyo título o descripción contenga dicho término.
- `page` (número, opcional): Número de página para la paginación (>= 1, por defecto 1). Siempre se devuelven 12 resultados.
- `sort` (cadena, opcional): Criterio de ordenación ascendente (`distance` [por defecto], `price`, `views`).
- `user` (número, opcional): ID del usuario a consultar. Si no se especifica, devuelve los productos del usuario autenticado.
- `status` (cadena, opcional): Estado de los productos a consultar. Valores posibles:
  - `selling` (por defecto): Productos actualmente a la venta (no vendidos).
  - `sold`: Productos vendidos por el usuario.
  - `bought`: Productos comprados por el usuario.

*Ejemplos de peticiones:*
- Mis productos en venta: `GET /products/user` (o `GET /products/user?status=selling`)
- Filtrar mis productos por texto: `GET /products/user?search=movil`
- Mis productos vendidos: `GET /products/user?status=sold`
- Mis productos comprados: `GET /products/user?status=bought`
- Productos en venta de otro usuario buscando "bici" ordenados por precio: `GET /products/user?user=5&search=bici&sort=price`
- Productos vendidos de otro usuario: `GET /products/user?user=5&status=sold`
- Productos comprados de otro usuario: `GET /products/user?user=5&status=bought`

**Respuesta exitosa (200 OK):** `{ "products": [ ... ], "page": 1, "total_pages": 1, "total_products": 7 }`

---

### **GET /products/:id**

Obtiene el detalle completo de un producto por su ID, incluyendo su galería de fotos, el usuario comprador (si está vendido) y los datos de valoración de la transacción.

**Respuesta exitosa (200 OK):**

```json
{
  "product": {
    "id": 1,
    "title": "Bicicleta de montaña",
    "description": "Bicicleta en perfecto estado.",
    "price": 150.5,
    "status": 3,
    "datePublished": "2026-03-15T10:00:00.000Z",
    "numVisits": 15,
    "category": {
      "id": 4,
      "name": "Deportes"
    },
    "owner": {
      "id": 2,
      "name": "María Gómez",
      "email": "maria@correo.es",
      "lat": 38.39,
      "lng": -0.51,
      "photo": "http://localhost:3000/img/users/1741818000-uuid.jpg"
    },
    "soldTo": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@correo.es",
      "lat": 38.4,
      "lng": -0.52,
      "photo": "http://localhost:3000/img/users/1741818200-uuid.jpg"
    },
    "mainPhoto": "http://localhost:3000/img/products/1741818100-uuid.jpg",
    "photos": [
      {
        "id": 1,
        "url": "http://localhost:3000/img/products/1741818100-uuid.jpg"
      },
      {
        "id": 2,
        "url": "http://localhost:3000/img/products/1741818150-uuid.jpg"
      }
    ],
    "rating": {
      "sellerRating": 5,
      "buyerRating": 4,
      "sellerComment": "Comprador rápido y formal",
      "buyerComment": "Todo según lo acordado",
      "dateTransaction": "2026-03-16T14:30:00.000Z"
    },
    "distance": 1.45,
    "bookmarked": true,
    "mine": false
  }
}
```

**Errores posibles:**
- **404 Not Found**: Si el producto no existe en la base de datos.

---

### **POST /products**

Publica un nuevo producto a nombre del usuario autenticado. Su estado inicial será `1` (en venta). La imagen principal se almacena en disco y se vincula automáticamente.

**Petición (`application/json`):**

```json
{
  "title": "Monitor 27 pulgadas 4K",
  "description": "Monitor IPS sin arañazos, incluye cable HDMI y de corriente.",
  "price": 220.0,
  "category": 1,
  "mainPhoto": "data:image/jpeg;base64,..."
}
```

*Validaciones:*
- `title`: Entre 3 y 250 caracteres.
- `description`: Cadena obligatoria.
- `price`: Número estrictamente positivo (> 0).
- `category`: ID numérico entero de una categoría existente.
- `mainPhoto`: Cadena en Base64.

**Respuesta exitosa (201 Created):** Objeto con el producto recién creado (`{ "product": { ... } }`).

---

### **PUT /products/:id**

Modifica los datos de un producto existente. Solo el propietario del producto tiene permiso para editarlo.

Los campos son opcionales:
- **Datos básicos:** `title`, `description`, `price`, `category`.
- **Cambio de estado:** `status` (valores del enum `ProductStatus`: `1` = En venta, `2` = Reservado, `3` = Vendido). Si se marca como vendido (`status = 3`), es obligatorio enviar el ID del comprador en `soldTo`.
- **Foto principal:** `mainPhoto` con el ID numérico de una foto existente del producto.

*Ejemplo de actualización:*

```json
{
  "title": "Monitor 27 pulgadas 4K (Rebajado)",
  "price": 199.99
}
```

**Respuesta exitosa (200 OK):** Objeto con el producto actualizado (`{ "product": { ... } }`).

**Errores posibles:**
- **403 Forbidden**: Si el usuario autenticado no es el dueño del producto.
- **404 Not Found**: Si el producto no existe.

---

### **PUT /products/:id/buy**

Marca un producto como comprado por el usuario autenticado. Esta operación se ejecuta de manera atómica con transacciones de base de datos (`em.transactional()`), cambiando el estado a vendido (`status = 3`), asignando el comprador (`soldTo`) y creando el registro de la transacción.

**Petición:** Cuerpo vacío.

**Reglas de negocio:**
1. **No puedes comprar tu propio producto**: Devuelve **400 Bad Request**.
2. **No puedes comprar un producto ya vendido**: Devuelve **409 Conflict**.

**Respuesta exitosa (204 No Content):** Sin contenido.

**Errores posibles:**
- **400 Bad Request**: "You cannot buy your own product".
- **404 Not Found**: "Product not found".
- **409 Conflict**: "This product has already been sold".

---

### **DELETE /products/:id**

Elimina un producto de la base de datos y **borra físicamente sus imágenes del disco** para evitar fugas de almacenamiento. Solo el propietario puede borrarlo.

**Respuesta exitosa (204 No Content):** Sin contenido.

**Errores posibles:**
- **403 Forbidden**: Si no eres el dueño del producto.
- **404 Not Found**: Si el producto no existe.

---

### **POST /products/:id/bookmarks**

Añade el producto indicado a la lista de favoritos del usuario autenticado.

**Petición:** Cuerpo vacío.  
**Respuesta exitosa (204 No Content):** Sin contenido.

---

### **DELETE /products/:id/bookmarks**

Elimina el producto indicado de la lista de favoritos del usuario autenticado.

**Petición:** Cuerpo vacío.  
**Respuesta exitosa (204 No Content):** Sin contenido.

---

### **POST /products/:id/photos**

Añade una foto adicional a la galería de un producto. Si se envía `"setMain": true`, además se establecerá como imagen principal.

**Petición (`application/json`):**

```json
{
  "photo": "data:image/jpeg;base64,...",
  "setMain": true
}
```

**Respuesta exitosa (201 Created):**

```json
{
  "photo": {
    "id": 12,
    "url": "http://localhost:3000/img/products/1741818500-uuid.jpg"
  }
}
```

---

### **DELETE /products/:idProd/photos/:idPhoto**

Elimina una fotografía específica de la galería de un producto y **borra físicamente el archivo de imagen del disco**. Solo el dueño del producto puede realizar esta acción.

**Respuesta exitosa (204 No Content):** Sin contenido.

**Errores posibles:**
- **403 Forbidden**: Si el usuario no es el propietario del producto.
- **404 Not Found**: Si el producto o la foto no existen.

---

## Colección /users

Todos los servicios requieren cabecera `Authorization: Bearer <auth_token>`.

### **GET /users/me**

Devuelve los datos del perfil del usuario actualmente autenticado. La propiedad `me` será siempre `true`.

**Respuesta exitosa (200 OK):**

```json
{
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan.perez@correo.es",
    "lat": 38.4018,
    "lng": -0.5241,
    "photo": "http://localhost:3000/img/users/1741818000-uuid.jpg",
    "registrationDate": "2026-03-01T12:00:00.000Z",
    "me": true
  }
}
```

---

### **GET /users/:id**

Devuelve el perfil público del usuario indicado por su ID numérico. La propiedad `me` valdrá `true` si coincide con el usuario autenticado, o `false` en caso contrario.

**Respuesta exitosa (200 OK):** `{ "user": { ... } }`

**Errores posibles:**
- **404 Not Found**: Si el usuario no existe.

---

### **GET /users/name/:name**

Busca y devuelve los usuarios cuyo nombre contenga la subcadena indicada en el parámetro de ruta.

**Respuesta exitosa (200 OK):**

```json
{
  "users": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan.perez@correo.es",
      "lat": 38.4018,
      "lng": -0.5241,
      "photo": "http://localhost:3000/img/users/1741818000-uuid.jpg",
      "registrationDate": "2026-03-01T12:00:00.000Z",
      "me": true
    }
  ]
}
```

---

### **PUT /users/me**

Actualiza el nombre y/o el correo electrónico del usuario autenticado.

**Petición (`application/json`):**

```json
{
  "name": "Juan Antonio Pérez",
  "email": "juanantonio@correo.es"
}
```

**Respuesta exitosa (204 No Content):** Sin contenido.

**Errores posibles:**
- **400 Bad Request**: Formato de datos no válido.
- **409 Conflict**: Si el correo electrónico ya está en uso por otro usuario.

---

### **PUT /users/me/photo**

Actualiza la foto de perfil del usuario autenticado. La imagen anterior se reemplaza y la nueva se almacena en disco.

**Petición (`application/json`):**

```json
{
  "photo": "data:image/jpeg;base64,..."
}
```

**Respuesta exitosa (200 OK):**

```json
{
  "photo": "http://localhost:3000/img/users/1741818600-uuid.jpg"
}
```

---

### **PUT /users/me/password**

Actualiza la contraseña del usuario autenticado. La nueva contraseña se cifra con un hash seguro con salt (**bcrypt**).

**Petición (`application/json`):**

```json
{
  "password": "NuevaPasswordSegura123!"
}
```

**Respuesta exitosa (204 No Content):** Sin contenido.

---

## Colección /ratings

Todos los servicios requieren cabecera `Authorization: Bearer <auth_token>`.

### **POST /ratings**

Permite valorar una transacción completada sobre un producto que el usuario autenticado haya comprado o vendido.

**Reglas de negocio:**
- El producto debe estar vendido (`status = 3`).
- El usuario debe ser el comprador o el vendedor del producto.
- Solo se permite una valoración por parte de cada rol (comprador / vendedor).

**Petición (`application/json`):**

```json
{
  "product": 1,
  "rating": 5,
  "comment": "Excelente vendedor, producto impecable."
}
```

*Validaciones:*
- `product`: ID numérico del producto vendido.
- `rating`: Valor entero entre 1 y 5.
- `comment`: Comentario sobre la transacción.

**Respuesta exitosa (204 No Content):** Sin contenido.

**Errores posibles:**
- **400 Bad Request**: Datos no válidos.
- **403 Forbidden**: Si el producto no está vendido, si el usuario no formó parte de la transacción o si ya emitió su valoración anteriormente.
- **404 Not Found**: Si el producto no existe.

---

### **GET /ratings/user/me**

Devuelve la lista de valoraciones recibidas por el usuario autenticado como comprador o vendedor en transacciones pasadas.

**Respuesta exitosa (200 OK):**

```json
{
  "ratings": [
    {
      "rating": 5,
      "comment": "Excelente vendedor, producto impecable.",
      "product": {
        "id": 1,
        "title": "Bicicleta de montaña",
        "price": 150.5,
        "status": 3
      },
      "user": {
        "id": 1,
        "name": "Juan Pérez",
        "photo": "http://localhost:3000/img/users/1741818000-uuid.jpg"
      }
    }
  ]
}
```

---

### **GET /ratings/user/:idUser**

Devuelve la lista de valoraciones recibidas por el usuario cuyo ID numérico se especifica en la URL.

**Respuesta exitosa (200 OK):** Idéntico formato que `/ratings/user/me`.
