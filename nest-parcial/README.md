# Proyecto Base — Parcial Práctico Backend (NestJS + MongoDB)

API REST en NestJS y Mongoose para la gestión de **Usuarios (`/users`)** y **Tareas (`/tasks`)**.

---

## Requisitos Previos

- **Node.js** 18+ y **npm**
- **Docker Desktop** (o instancia local de MongoDB en el puerto `27017`)

---

## Instalación y Puesta en Marcha

1. **Levantar la base de datos MongoDB:**
   ```bash
   docker compose up -d
   ```
   *(Si utilizas una instancia local o MongoDB Atlas diferente a `mongodb://localhost:27017/nest-parcial`, configura la variable `MONGODB_URI` en un archivo `.env` tomando como base `.env.example`.)*

2. **Instalar dependencias del proyecto:**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación en modo desarrollo:**
   ```bash
   npm run start:dev
   ```
   El servidor quedará disponible en `http://localhost:3000`.

---

## Pruebas y Validación

- **Ejecutar pruebas unitarias:**
  ```bash
  npm test
  ```
- **Ejecutar pruebas end-to-end:**
  ```bash
  npm run test:e2e
  ```
- **Verificar compilación y linter:**
  ```bash
  npm run build
  npm run lint
  ```

---

## Endpoints del Sistema

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Público | Verificación básica del servidor |
| `POST` | `/users` | Público | Crear usuario (`name`, `email`) |
| `GET` | `/users` | Público | Listar usuarios registrados |
| `GET` | `/users/:id` | Público | Consultar usuario por ID |
| `GET` | `/tasks` | Público | Listar tareas registradas |
| `GET` | `/tasks/:id` | Público | Consultar tarea por ID |
| `POST` | `/tasks` | Restringido (`Authorization: admin-secret-token`) | Crear una tarea asociada a un usuario |

También puedes importar `nest-parcial.postman_collection.json` en Postman o utilizar `requests.http` con la extensión REST Client de VS Code para probar manualmente los endpoints.

## Evidencia de Funcionamiento

### Caso1
Creé `CreateTaskDto` con `class-validator`, permitiendo únicamente `title`, `description`, `completed` y `userId`. También configuré un `ValidationPipe` global en `main.ts` con `whitelist` y `forbidNonWhitelisted`, y cambié el esquema de tareas a `strict: true`. Al enviar `isAdmin`, `role` e `internalFlag`, la API ahora responde `400 Bad Request`: `{"message":["property isAdmin should not exist","property role should not exist","property internalFlag should not exist"],"error":"Bad Request","statusCode":400}`

### Caso2
Hice que `UsersModule` exportara `UsersService` y lo importé en `TasksModule`, eliminando de este último el registro de `UserSchema`. Ahora tareas verifica la existencia del usuario únicamente mediante `UsersService`. Al crear una tarea con un usuario inexistente, la API responde `404 Not Found`: `{"message":"Usuario con ID 600000000000000000000000 no encontrado","error":"Not Found","statusCode":404}`

### Caso3
Eliminé `AuthMiddleware` y creé `AuthGuard`, que valida la cabecera `Authorization` y lanza `ForbiddenException` cuando no es válida. Lo apliqué únicamente a `POST /tasks`. Sin credenciales, `GET /tasks` y `GET /tasks/:id` responden `200 OK`, mientras que `POST /tasks` responde `403 Forbidden` con el formato estándar: `{"message":"Prohibido","error":"Forbidden","statusCode":403}`

### Caso4
Eliminé los modelos de Mongoose de `TasksController`, que ahora depende exclusivamente de `TasksService`. Trasladé la validación del usuario y la persistencia al método `create` del servicio. Agregué una prueba unitaria que mockea solo `TasksService`; `npm test` finaliza con `Test Suites: 2 passed, 2 total` y `Tests: 2 passed, 2 total`. Un `POST /tasks` válido responde `201 Created`