# Auth Service - Microservicio de Autenticación

API REST para manejo de autenticación de usuarios con JWT y PostgreSQL.

## 🚀 Tecnologías

- Node.js + Express
- TypeScript
- PostgreSQL + TypeORM
- JWT (JSON Web Tokens)
- Bcrypt para encriptación
- Docker

## 📋 Endpoints

### POST /api/auth/register
Registrar un nuevo usuario
```json
{
  "name": "Usuario",
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

### POST /api/auth/login
Iniciar sesión
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

### POST /api/auth/refresh
Refrescar el access token usando refresh token
```json
{
  "refreshToken": "tu_refresh_token"
}
```

### GET /api/auth/profile
Obtener perfil del usuario autenticado (requiere token)

### POST /api/auth/logout
Cerrar sesión (invalidar refresh token)

### GET /api/health
Health check del servicio

## 🛠️ Instalación

```bash
npm install
```

## 🔧 Configuración

1. Copia `.env.example` a `.env`
2. Configura las variables de entorno

## 🐳 Docker (Recomendado)

Necesitas tener Docker instalado: [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop)

### Ejecutar con Docker Compose:
```bash
# Construir e iniciar todos los servicios (PostgreSQL + Auth Service)
docker compose up -d --build

# Ver logs
docker compose logs -f

# Detener servicios
docker compose down

# Detener y eliminar volúmenes
docker compose down -v
```

El servicio estará disponible en `http://localhost:3001`

### Construir imagen independiente:
```bash
docker build -t auth-service .
docker run -p 3001:3001 auth-service
```

## 🏃 Ejecutar sin Docker

```bash
# Desarrollo (necesitas PostgreSQL corriendo)
npm run dev

# Producción
npm run build
npm start
```

## 🚂 Deploy en Railway

1. **Crear repositorio en GitHub**
   ```bash
   git init
   git add .
   git commit -m "Auth service"
   git remote add origin https://github.com/tu-usuario/auth-service.git
   git push -u origin main
   ```

2. **En Railway**:
   - New Project → Deploy from GitHub
   - Selecciona tu repositorio
   - Agrega PostgreSQL: New → Database → PostgreSQL
   - Configura variables de entorno:
     - `JWT_SECRET`
     - `JWT_REFRESH_SECRET`
     - `CORS_ORIGIN` (URL de tu frontend)
     - `NODE_ENV=production`
   - Railway configura `DATABASE_URL` automáticamente

3. **Deploy automático** ✅
   - Railway construirá usando el Dockerfile
   - Desplegará automáticamente en cada push

## 🌍 Variables de Entorno

```env
# Servidor
PORT=3001
NODE_ENV=development

# PostgreSQL (local)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=auth_service

# Railway usa DATABASE_URL automáticamente
# DATABASE_URL=postgresql://user:pass@host:port/db

# JWT
JWT_SECRET=tu_secreto_jwt
JWT_REFRESH_SECRET=tu_secreto_refresh
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 📝 Estructura

```
auth-service/
├── src/
│   ├── config/          # Configuración DB y JWT
│   ├── controllers/     # Lógica de negocio
│   ├── middleware/      # Auth, validación, errores
│   ├── models/          # Entidades TypeORM
│   ├── routes/          # Rutas Express
│   ├── types/           # Tipos TypeScript
│   └── utils/           # Utilidades JWT
├── Dockerfile
├── docker-compose.yml
├── package.json
└── tsconfig.json
```
