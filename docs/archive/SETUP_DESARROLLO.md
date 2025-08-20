# 🚀 Guía de Setup y Desarrollo Local

## 📋 Prerequisitos

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **Git** ([Descargar](https://git-scm.com/))
- **PostgreSQL** (para desarrollo local) o cuenta en [Render](https://render.com)

## ⚡ Instalación Rápida

### 1. **Clonar Repositorio**

```bash
git clone https://github.com/LeaGuevara01/node.git
cd node
```

### 2. **Instalar Dependencias**

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. **Configurar Variables de Entorno**

#### Backend (`server/.env`)

```bash
cd server
cp .env.example .env
```

Editar `.env` con tus valores:

```env
# Base de datos (ejemplo para desarrollo local)
DATABASE_URL="postgresql://usuario:password@localhost:5432/sistema_agricola"

# JWT
JWT_SECRET="tu_secret_key_muy_seguro_aqui"

# CORS (para desarrollo)
CORS_ORIGIN="http://localhost:3000,http://localhost:5173"

# Puerto del servidor
PORT=4000
```

#### Frontend (`client/.env`)

```bash
cd ../client
echo "VITE_API_URL=http://localhost:4000/api" > .env
```

### 4. **Configurar Base de Datos**

#### Opción A: PostgreSQL Local

```bash
# Instalar PostgreSQL localmente
# Crear base de datos
createdb sistema_agricola

# Ejecutar migraciones
cd server
npx prisma migrate dev
npx prisma generate
```

#### Opción B: Base de Datos en Render (Recomendado)

1. Ir a [Render Dashboard](https://dashboard.render.com/)
2. Crear nueva PostgreSQL Database
3. Copiar la `DATABASE_URL` al `.env`
4. Ejecutar migraciones:

```bash
cd server
npx prisma migrate dev
npx prisma generate
```

### 5. **Importar Datos Iniciales**

```bash
cd server
node scripts/import-repuestos.js
```

### 6. **Iniciar Desarrollo**

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend (nueva terminal)
cd client
npm run dev
```

## 🌐 URLs de Desarrollo

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **API Health**: http://localhost:4000/api/health
- **Prisma Studio**: http://localhost:5555 (ejecutar `npx prisma studio`)

## 🔧 Scripts Disponibles

### Backend (`server/`)

```bash
npm run dev          # Desarrollo con nodemon
npm start           # Producción
npm test            # Ejecutar tests
npm run migrate     # Aplicar migraciones
npm run studio      # Abrir Prisma Studio
```

### Frontend (`client/`)

```bash
npm run dev         # Desarrollo con Vite
npm run build       # Build para producción
npm run preview     # Preview del build
npm run lint        # Linter
```

## 🐛 Solución de Problemas Comunes

### Error de Conexión a Base de Datos

```bash
# Verificar conexión
cd server
npx prisma db pull
```

### Error de CORS

Verificar que `CORS_ORIGIN` en `.env` incluya la URL del frontend:

```env
CORS_ORIGIN="http://localhost:3000,http://localhost:5173"
```

### Puerto en Uso

```bash
# Verificar qué está usando el puerto
netstat -an | findstr :4000

# Cambiar puerto en server/.env
PORT=4001
```

### Módulos no Encontrados

```bash
# Limpiar e instalar
rm -rf node_modules package-lock.json
npm install
```

## 📊 Verificar Instalación

### 1. **Backend Health Check**

```bash
curl http://localhost:4000/api/health
```

Respuesta esperada:

```json
{
  "status": "OK",
  "timestamp": "2025-08-03T12:00:00.000Z",
  "database": "connected"
}
```

### 2. **Frontend Funcionando**

- Navegar a http://localhost:5173
- Debería mostrar la página de login
- Sin errores en consola del navegador

### 3. **Base de Datos Conectada**

```bash
cd server
npx prisma studio
```

Debería abrir la interface visual de la base de datos.

## 🚀 Siguiente Paso

Una vez configurado el entorno local, consultar:

- [`API_REFERENCE.md`](./API_REFERENCE.md) - Para entender la API
- [`SISTEMA_FILTROS.md`](./SISTEMA_FILTROS.md) - Para usar los filtros avanzados
- [`GUIA_COMPLETA.md`](./GUIA_COMPLETA.md) - Para arquitectura completa

## 🆘 Soporte

Si tienes problemas:

1. Revisar [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md)
2. Verificar logs en terminal
3. Crear issue en GitHub con detalles del error
