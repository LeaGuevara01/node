# 🚀 Deploy con Base de Datos Existente en Render

## Tu Configuración Actual

**Base de Datos PostgreSQL en Render:**

- **Hostname**: dpg-d1qpnlodl3ps73eln790-a.oregon-postgres.render.com
- **Database**: sistema_gestion_agricola
- **Username**: elorza
- **Password**: g65hHAdGLwoOYl33zlPRnVyzdsY6FsD1
- **URL Externa**: `postgresql://elorza:g65hHAdGLwoOYl33zlPRnVyzdsY6FsD1@dpg-d1qpnlodl3ps73eln790-a.oregon-postgres.render.com/sistema_gestion_agricola`

## 🎯 Opción Recomendada: Deploy con Blueprint

Ya tienes una base de datos configurada, así que usa el archivo `render.yaml` actualizado que reutiliza tu configuración existente.

### Pasos para Deploy:

#### 1. Verificar configuración

```powershell
# Ejecutar script de verificación
.\scripts\verify-deploy.ps1
```

#### 2. Commit y push a GitHub

```bash
git add .
git commit -m "Deploy configuration with existing database"
git push origin main
```

#### 3. Deploy en Render

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en "New" → "Blueprint"
3. Conecta tu repositorio de GitHub
4. Selecciona el archivo `render.yaml`
5. Haz clic en "Apply"

### 📱 URLs después del deploy:

**Backend**: https://sistemagestionagricola.onrender.com

- API: https://sistemagestionagricola.onrender.com/api
- Health: https://sistemagestionagricola.onrender.com/api/health
- Docs: https://sistemagestionagricola.onrender.com/api/docs

**Frontend**: https://sistemagestionagricola-frontend.onrender.com

## 🔧 Configuración Aplicada

### Backend (`sistemagestionagricola`)

```yaml
envVars:
  NODE_ENV: production
  PORT: 4000
  JWT_SECRET: g5n/luqG5cC8d+64IqsJaQPIPVOXrxzORpQPREDaursgxx8sSMVyLx6xq8bNlIcv
  DATABASE_URL: postgresql://elorza:g65hHAdGLwoOYl33zlPRnVyzdsY6FsD1@dpg-d1qpnlodl3ps73eln790-a.oregon-postgres.render.com/sistema_gestion_agricola
  CORS_ORIGIN: https://sistemagestionagricola-frontend.onrender.com
```

### Frontend (`sistemagestionagricola-frontend`)

```yaml
envVars:
  VITE_API_URL: https://sistemagestionagricola.onrender.com/api
```

## 🚨 Importante

### ✅ Ventajas de usar tu DB existente:

- No necesitas crear una nueva base de datos
- Conservas todos los datos existentes
- Reutilizas la configuración que ya funciona
- Deploy más rápido

### ⚠️ Consideraciones:

- Los nombres de servicios serán `sistemagestionagricola` y `sistemagestionagricola-frontend`
- Si tienes servicios existentes con esos nombres, pueden conflictuar
- La base de datos ya está configurada, no se modificará

## 🔄 Si necesitas cambiar nombres de servicios:

Puedes editar el `render.yaml` y cambiar los nombres:

```yaml
services:
  - type: web
    name: tu-nombre-backend-aqui # Cambiar aquí
  - type: web
    name: tu-nombre-frontend-aqui # Cambiar aquí
```

Y actualizar las variables de entorno correspondientes para que coincidan las URLs.

## 🐛 Troubleshooting

### Error: Service name already exists

Si ya tienes servicios con esos nombres:

1. Edita `render.yaml` y cambia los nombres de servicios
2. Actualiza las URLs en CORS_ORIGIN y VITE_API_URL
3. Vuelve a aplicar el blueprint

### Error: Database connection failed

Tu base de datos ya está configurada y funcionando. Si hay problemas:

1. Verifica que la URL de conexión sea correcta
2. Asegúrate de que Prisma se genere correctamente: `npx prisma generate`
3. Verifica que el esquema sea correcto: `npx prisma db pull`

### Error: Build failed

```bash
# En el build command, Render ejecuta:
npm install && npx prisma generate

# Si falla, verifica que package.json tenga:
"engines": {
  "node": ">=18.0.0"
}
```

## ✅ Checklist pre-deploy

- [ ] Base de datos conecta correctamente ✅ (ya verificado)
- [ ] Prisma schema actualizado ✅ (ya verificado)
- [ ] Variables de entorno configuradas ✅
- [ ] CORS configurado para el frontend ✅
- [ ] Health check endpoint disponible ✅
- [ ] Build commands correctos ✅
- [ ] Código en GitHub ✅

## 🚀 ¡Listo para Deploy!

Tu configuración está preparada para usar la base de datos existente. El deploy debería ser muy rápido ya que no necesita crear nuevos recursos de base de datos.
