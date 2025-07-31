# 🚀 Deploy Configurado para tu Proyecto

## Tu Configuración Actual

Basado en tu setup existente de Render, aquí está la configuración actualizada:

### 📡 URLs de tu Sistema

- **Backend API**: `https://sistemagestionagricola.onrender.com/api`
- **Frontend App**: `https://sistemagestionagricola.onrender.com`
- **Base de Datos**: Ya configurada y funcionando

### 🔗 Configuración de Base de Datos

```
Host: dpg-d1qpnlodl3ps73eln790-a.oregon-postgres.render.com
Database: sistema_gestion_agricola
User: elorza
```

## 🎯 Pasos para Deploy

### Opción 1: Deploy con Blueprint (Recomendado)

1. **Push tu código actualizado**:

   ```bash
   git add .
   git commit -m "Updated config for existing Render setup"
   git push origin main
   ```

2. **En Render Dashboard**:
   - Ir a "Blueprints"
   - Seleccionar "New Blueprint"
   - Connect tu repositorio
   - Seleccionar el archivo `render.yaml`
   - Deploy!

### Opción 2: Deploy Manual

Si ya tienes servicios creados en Render, solo necesitas:

1. **Actualizar el backend existente**:

   - Ir a tu servicio backend en Render
   - Environment: añadir las variables que falten
   - Deploy manual

2. **Crear el frontend**:
   - New Static Site
   - Connect repo
   - Build command: `cd client && npm install && npm run build`
   - Publish directory: `client/dist`

## 🔧 Variables de Entorno

### Backend (ya configuradas en tu .env)

```bash
NODE_ENV=production
PORT=4000
JWT_SECRET=g5n/luqG5cC8d+64IqsJaQPIPVOXrxzORpQPREDaursgxx8sSMVyLx6xq8bNlIcv
DATABASE_URL=postgresql://elorza:g65hHAdGLwoOYl33zlPRnVyzdsY6FsD1@dpg-d1qpnlodl3ps73eln790-a.oregon-postgres.render.com/sistema_gestion_agricola
CORS_ORIGIN=https://sistemagestionagricola.onrender.com
```

### Frontend

```bash
VITE_API_URL=https://sistemagestionagricola.onrender.com/api
```

## ✅ Verificación

1. **Verificar configuración**:

   ```powershell
   .\scripts\verify-deploy.ps1
   ```

2. **Test local** (opcional):

   ```bash
   # Backend (puerto 4001 para evitar conflictos)
   cd server
   $env:PORT=4001; npm start

   # Frontend
   cd client
   npm run dev
   ```

3. **Verificar conexión DB**:
   ```bash
   cd server
   npx prisma db pull  # Ya funcionó ✅
   ```

## 🚨 Notas Importantes

- ✅ **Base de Datos**: Ya tienes una DB funcionando, no necesitas crear nueva
- ✅ **Schema**: Prisma ya sincronizó con tu DB existente
- ✅ **Configuración**: Todo apunta a tus servicios actuales
- ⚠️ **CORS**: Asegúrate que el backend tenga el CORS correcto para el frontend

## 🔄 Proceso de Deploy

Una vez que hagas el deploy:

1. **Backend se desplegará** en `sistemagestionagricola.onrender.com`
2. **Frontend se desplegará** en `agroservicios-app.onrender.com`
3. **Frontend apuntará** al backend existente
4. **Base de datos** seguirá siendo la misma que ya tienes

## 🆘 Si algo falla

1. **Check logs** en Render Dashboard
2. **Verificar URLs** en las variables de entorno
3. **Test endpoints**:
   - `https://sistemagestionagricola.onrender.com/api/health`
   - `https://sistemagestionagricola.onrender.com/api/docs`

¿Todo listo para hacer el deploy?
