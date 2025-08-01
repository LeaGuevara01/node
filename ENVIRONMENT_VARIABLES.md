# 📝 VARIABLES DE ENTORNO PARA CONFIGURAR MANUALMENTE

## ⚠️ IMPORTANTE: Configuración Post-Deploy

Después de que se cree el servicio backend en Render, agregar estas variables manualmente:

### Backend Service: `sistemagestionagricola`

**Environment Variables a agregar en Dashboard:**

```
JWT_SECRET = g5n/luqG5cC8d+64IqsJaQPIPVOXrxzORpQPREDaursgxx8sSMVyLx6xq8bNlIcv
DATABASE_URL = postgresql://elorza:g65hHAdGLwoOYl33zlPRnVyzdsY6FsD1@dpg-d1qpnlodl3ps73eln790-a.oregon-postgres.render.com/sistema_gestion_agricola
```

## 🔧 Cómo configurar:

1. Ve a Dashboard → sistemagestionagricola → Environment
2. Click "Add Environment Variable"
3. Agrega cada variable por separado
4. Click "Save Changes"
5. El servicio se redesplegará automáticamente
