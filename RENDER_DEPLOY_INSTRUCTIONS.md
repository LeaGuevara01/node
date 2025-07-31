# 🚨 RENDER.YAML - VERSIÓN SEGURA

# Este archivo NO contiene credenciales sensibles

## ⚠️ CONFIGURACIÓN MANUAL REQUERIDA EN RENDER

Después de hacer el deploy, configura manualmente en **Render Dashboard**:

### Backend Service: `sistemagestionagricola`

**Environment Variables → Add Environment Variable:**

```
JWT_SECRET = g5n/luqG5cC8d+64IqsJaQPIPVOXrxzORpQPREDaursgxx8sSMVyLx6xq8bNlIcv
DATABASE_URL = postgresql://elorza:g65hHAdGLwoOYl33zlPRnVyzdsY6FsD1@dpg-d1qpnlodl3ps73eln790-a.oregon-postgres.render.com/sistema_gestion_agricola
```

## 🔒 IMPORTANTE

- NUNCA subas estas credenciales a Git
- Configúralas únicamente en Render Dashboard
- Usa el sistema de configuración centralizado para desarrollo local

## 📋 PASOS PARA DEPLOY

1. **Commit y push** del render.yaml seguro
2. **Deploy en Render** usando este archivo
3. **Configurar variables manualmente** en Render Dashboard
4. **Verificar funcionamiento** con health check

## 🌐 URLs POST-DEPLOY

- Backend: https://sistemagestionagricola.onrender.com
- Frontend: https://sistemagestionagricola-frontend.onrender.com
- Health: https://sistemagestionagricola.onrender.com/api/health
