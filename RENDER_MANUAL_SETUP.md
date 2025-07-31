# 🔧 DEPLOY MANUAL EN RENDER

## 🖥️ BACKEND - Manual Setup

### 1. Crear Web Service

- **New** → **Web Service**
- **Connect Repository**: `LeaGuevara01/node`
- **Root Directory**: `server`
- **Environment**: `Node`
- **Region**: `Oregon`
- **Branch**: `main`

### 2. Build & Start Commands

```bash
# Build Command:
npm install && npx prisma generate

# Start Command:
npm start
```

### 3. Environment Variables

```
NODE_ENV=production
PORT=4000
JWT_SECRET=g5n/luqG5cC8d+64IqsJaQPIPVOXrxzORpQPREDaursgxx8sSMVyLx6xq8bNlIcv
DATABASE_URL=postgresql://elorza:g65hHAdGLwoOYl33zlPRnVyzdsY6FsD1@dpg-d1qpnlodl3ps73eln790-a.oregon-postgres.render.com/sistema_gestion_agricola
CORS_ORIGIN=https://[frontend-url].onrender.com
PRISMA_HIDE_UPDATE_MESSAGE=true
CHECKPOINT_DISABLE=1
```

### 4. Health Check

```
Health Check Path: /api/health
```

---

## 🌐 FRONTEND - Manual Setup

### 1. Crear Static Site

- **New** → **Static Site**
- **Connect Repository**: `LeaGuevara01/node`
- **Root Directory**: `client`
- **Branch**: `main`

### 2. Build Settings

```bash
# Build Command:
npm install && npm run build

# Publish Directory:
dist
```

### 3. Environment Variables

```
VITE_API_URL=https://[backend-url].onrender.com/api
```

### 4. Headers & Redirects

```yaml
# Headers:
/*
  Cache-Control: no-cache

/assets/*
  Cache-Control: max-age=31536000

# Redirects:
/*  /index.html  200
```

---

## 🔄 ORDEN DE DEPLOY

1. **Deploy Backend primero**
2. **Copiar URL del backend**
3. **Actualizar VITE_API_URL en frontend**
4. **Deploy Frontend**
5. **Actualizar CORS_ORIGIN en backend**
