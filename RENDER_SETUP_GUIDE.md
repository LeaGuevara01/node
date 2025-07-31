# 🚀 GUÍA DE DEPLOY EN RENDER

## 📦 PASO 1: Deploy con render.yaml

### 1.1 Conectar Repositorio

1. Ve a **Render Dashboard** (https://dashboard.render.com)
2. Click **"New"** → **"Blueprint"**
3. Conecta tu repositorio GitHub: `LeaGuevara01/node`
4. Selecciona la rama `main`

### 1.2 Deploy Automático

- Render detectará automáticamente el `render.yaml`
- Creará 2 servicios:
  - **Backend**: `sistemagestionagricola`
  - **Frontend**: `sistemagestionagricola-frontend`

## ⚙️ PASO 2: Configurar Variables de Entorno

### 2.1 Backend Service

En **Render Dashboard** → **sistemagestionagricola** → **Environment**:

```
JWT_SECRET = g5n/luqG5cC8d+64IqsJaQPIPVOXrxzORpQPREDaursgxx8sSMVyLx6xq8bNlIcv
DATABASE_URL = postgresql://elorza:g65hHAdGLwoOYl33zlPRnVyzdsY6FsD1@dpg-d1qpnlodl3ps73eln790-a.oregon-postgres.render.com/sistema_gestion_agricola
```

### 2.2 Frontend Service

Ya está configurado automáticamente:

```
VITE_API_URL = https://sistemagestionagricola.onrender.com/api
```

## 🔍 PASO 3: Verificación

### 3.1 URLs de Verificación

- **Backend**: https://sistemagestionagricola.onrender.com/api/health
- **Frontend**: https://sistemagestionagricola-frontend.onrender.com
- **API Docs**: https://sistemagestionagricola.onrender.com/api/docs

### 3.2 Logs de Debug

- **Backend Logs**: Dashboard → sistemagestionagricola → Logs
- **Frontend Logs**: Dashboard → sistemagestionagricola-frontend → Logs

## 🚨 TROUBLESHOOTING

### Si el Backend falla:

1. Verificar que `JWT_SECRET` y `DATABASE_URL` estén configurados
2. Revisar logs para errores de Prisma
3. Verificar que la base de datos esté accesible

### Si el Frontend falla:

1. Verificar que el build de Vite funcione localmente
2. Revisar que `VITE_API_URL` apunte al backend correcto
3. Verificar la carpeta de salida `dist`

## ✅ CHECKLIST POST-DEPLOY

- [ ] Backend responde en `/api/health`
- [ ] Frontend carga correctamente
- [ ] Login funciona
- [ ] CORS configurado correctamente
- [ ] Base de datos accesible
- [ ] Variables de entorno configuradas
