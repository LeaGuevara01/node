# 🚀 Instrucciones de Deployment - RENDER DASHBOARD

## ✅ Tu render.yaml está configurado correctamente

### 📋 **Próximos Pasos en Render Dashboard:**

1. **Acepta la configuración del Blueprint**

   - La configuración que Render está mostrando es correcta
   - Procede con "Deploy"

2. **IMPORTANTE: Configurar DATABASE_URL inmediatamente después del deploy**

   **Ir a Backend Service → Environment:**

   ```
   Variable: DATABASE_URL
   Valor: postgresql://elorza:[TU-PASSWORD]@dpg-d1qpnlodl3ps73eln790-a:5432/sistema_gestion_agricola
   ```

   ⚠️ **Reemplaza [TU-PASSWORD] con tu password real de la base de datos**

3. **Verificar Variables de Entorno Automáticas:**

   - ✅ `NODE_ENV` = production
   - ✅ `PORT` = 4000
   - ✅ `JWT_SECRET` = (generado automáticamente)
   - ✅ `CORS_ORIGIN` = https://sistemagestionagricola-frontend.onrender.com
   - ⚠️ `DATABASE_URL` = (CONFIGURAR MANUALMENTE)

4. **Después del Deploy:**
   - Backend estará en: https://sistemagestionagricola.onrender.com
   - Frontend estará en: https://sistemagestionagricola-frontend.onrender.com
   - Health Check: https://sistemagestionagricola.onrender.com/api/health

## 🔧 **Si hay errores durante el build:**

### Backend (Node.js):

- Verificar que `server/package.json` existe
- Confirmar que Prisma schema es válido
- DATABASE_URL debe estar configurada para que `prisma db push` funcione

### Frontend (Static):

- Verificar que `client/package.json` existe
- Confirmar que `npm run build` genera carpeta `dist`
- VITE_API_URL debe apuntar al backend correcto

## 🎯 **¡Procede con el Deploy en Render Dashboard!**
