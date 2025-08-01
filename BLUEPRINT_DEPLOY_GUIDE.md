# 🚀 DEPLOY CON BLUEPRINTS - GUÍA PASO A PASO

## ✅ PRE-REQUISITOS VERIFICADOS

- [x] render.yaml configurado sin credenciales
- [x] Backend build funciona
- [x] Frontend build funciona
- [x] Repositorio GitHub sincronizado

---

## 📋 PASO 1: PREPARAR REPOSITORIO

### 1.1 Commit Final

```bash
git add .
git commit -m "feat: configuración completa para deploy en Render"
git push origin main
```

### 1.2 Verificar en GitHub

- Ve a: https://github.com/LeaGuevara01/node
- Confirma que `render.yaml` está en la raíz
- Confirma que NO hay credenciales en el archivo

---

## 🌐 PASO 2: CREAR BLUEPRINT EN RENDER

### 2.1 Acceder a Render Dashboard

1. **Ve a**: https://dashboard.render.com
2. **Login** con tu cuenta
3. **Click**: botón azul **"New +"**
4. **Selecciona**: **"Blueprint"**

### 2.2 Conectar Repositorio

1. **Connect a repository**
2. **Seleccionar**: `LeaGuevara01/node`
3. **Branch**: `main`
4. **Blueprint Name**: `sistema-gestion-agricola`
5. **Click**: **"Submit"**

### 2.3 Blueprint Detection

Render detectará automáticamente:

```
✅ render.yaml found
✅ 2 services configured:
   - sistemagestionagricola (web service)
   - sistemagestionagricola-frontend (static site)
```

---

## ⚙️ PASO 3: CONFIGURAR VARIABLES DE ENTORNO

### 3.1 Backend Service Environment

**Después de que se creen los servicios**, ve a:

- **Dashboard** → **sistemagestionagricola** → **Environment**

**Agregar estas variables**:

```
JWT_SECRET = g5n/luqG5cC8d+64IqsJaQPIPVOXrxzORpQPREDaursgxx8sSMVyLx6xq8bNlIcv
DATABASE_URL = postgresql://elorza:g65hHAdGLwoOYl33zlPRnVyzdsY6FsD1@dpg-d1qpnlodl3ps73eln790-a.oregon-postgres.render.com/sistema_gestion_agricola
```

### 3.2 Frontend Service Environment

- **Dashboard** → **sistemagestionagricola-frontend** → **Environment**
- **VITE_API_URL** ya está configurado automáticamente

---

## 🔄 PASO 4: MONITOREAR DEPLOY

### 4.1 Backend Deploy

1. **Ve a**: Dashboard → sistemagestionagricola → **Logs**
2. **Esperar mensaje**: `🚀 Servidor escuchando en puerto 4000`
3. **Verificar**: https://sistemagestionagricola.onrender.com/api/health

### 4.2 Frontend Deploy

1. **Ve a**: Dashboard → sistemagestionagricola-frontend → **Logs**
2. **Esperar**: `Build successful`
3. **Verificar**: https://sistemagestionagricola-frontend.onrender.com

---

## 🎯 PASO 5: VERIFICACIÓN FINAL

### 5.1 Tests de Funcionalidad

- [ ] **Backend Health**: https://sistemagestionagricola.onrender.com/api/health
- [ ] **Frontend Load**: https://sistemagestionagricola-frontend.onrender.com
- [ ] **API Docs**: https://sistemagestionagricola.onrender.com/api/docs
- [ ] **CORS Test**: Login desde frontend a backend

### 5.2 Si Todo Funciona

```
🎉 ¡DEPLOY EXITOSO!

URLs Finales:
- Frontend: https://sistemagestionagricola-frontend.onrender.com
- Backend:  https://sistemagestionagricola.onrender.com
- API:      https://sistemagestionagricola.onrender.com/api
- Docs:     https://sistemagestionagricola.onrender.com/api/docs
```

---

## 🚨 TROUBLESHOOTING

### Error: "Build failed"

1. **Check logs** en el servicio específico
2. **Verificar** que las dependencias estén en package.json
3. **Confirmar** que los comandos de build funcionan localmente

### Error: "Service unavailable"

1. **Verificar variables de entorno** están configuradas
2. **Check** que la base de datos esté accesible
3. **Revisar logs** para errores específicos

### Error: "CORS"

1. **Verificar** que CORS_ORIGIN apunte al frontend correcto
2. **Confirmar** que el frontend usa la URL correcta del backend

---

## 📞 SOPORTE

Si necesitas ayuda:

1. **Revisar logs** en Render Dashboard
2. **Verificar** que las URLs sean correctas
3. **Confirmar** variables de entorno
