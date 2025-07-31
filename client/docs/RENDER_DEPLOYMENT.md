# Guía de Despliegue en Render

## Preparación para el Despliegue

### 1. Configuración de Variables de Entorno

En Render, necesitas configurar las siguientes variables de entorno:

```
VITE_API_URL=https://tu-backend-render.onrender.com/api
```

### 2. Archivos de Configuración

#### render.yaml

Este archivo configura el servicio web estático en Render:

- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `./dist`
- **Headers de Seguridad**: Configurados para producción
- **Routing SPA**: Redirecciona todas las rutas a index.html

#### vite.config.js

Configuración optimizada para producción:

- **Code Splitting**: Separación de vendor y UI libraries
- **Minificación**: Terser con eliminación de console.log
- **Source Maps**: Habilitados para debugging
- **Chunks Manuales**: Optimización de carga

## Pasos para Desplegar

### 1. Preparar el Repositorio

```bash
# Asegúrate de que todos los archivos estén committeados
git add .
git commit -m "Configuración para deploy en Render"
git push origin main
```

### 2. Crear Servicio en Render

1. **Ir a [Render.com](https://render.com)**
2. **Conectar tu repositorio de GitHub/GitLab**
3. **Seleccionar "Static Site"**
4. **Configurar el servicio:**
   - **Name**: `sistema-gestion-agricola-frontend`
   - **Branch**: `main`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`

### 3. Configurar Variables de Entorno

En el dashboard de Render, agregar:

```
VITE_API_URL=https://tu-backend-render.onrender.com/api
```

### 4. Configurar Dominio Personalizado (Opcional)

1. **En Render Dashboard**: Settings → Custom Domains
2. **Agregar tu dominio**: ejemplo.com
3. **Configurar DNS**: Apuntar CNAME a tu-app.onrender.com

## Verificaciones Post-Despliegue

### 1. Funcionalidad Básica

- [ ] La aplicación carga correctamente
- [ ] El login funciona
- [ ] La navegación entre secciones funciona
- [ ] Las API calls al backend funcionan

### 2. Performance

- [ ] Tiempo de carga inicial < 3 segundos
- [ ] Navegación entre páginas es fluida
- [ ] Imágenes y assets cargan correctamente

### 3. Responsive Design

- [ ] Funciona en desktop (1920x1080)
- [ ] Funciona en tablet (768x1024)
- [ ] Funciona en mobile (375x667)

### 4. SEO y Meta Tags

- [ ] Title tag correcto
- [ ] Meta descriptions presentes
- [ ] Favicon visible
- [ ] Open Graph tags configurados

## Configuración de CI/CD Automático

Render se conecta automáticamente a tu repositorio y despliega en cada push a main.

### Branch Protection (Recomendado)

```bash
# Crear rama de desarrollo
git checkout -b develop
git push origin develop

# En GitHub/GitLab:
# 1. Hacer develop la rama por defecto para PRs
# 2. Proteger la rama main
# 3. Requerir review antes de merge
```

## Optimizaciones de Producción

### 1. Caching de Assets

Los assets estáticos (CSS, JS, imágenes) se cachean por 1 año:

```
Cache-Control: public, max-age=31536000, immutable
```

### 2. Compresión

Render aplica automáticamente:

- **Gzip** para archivos de texto
- **Brotli** para navegadores compatibles

### 3. CDN Global

Render incluye CDN global sin costo adicional.

## Monitoreo y Logs

### 1. Logs de Build

```bash
# Ver logs en tiempo real durante el build
# Disponible en Render Dashboard → Deploys
```

### 2. Analytics

Considera agregar:

- **Google Analytics**
- **Hotjar** para user behavior
- **Sentry** para error tracking

## Troubleshooting

### Error: Build Failed

```bash
# Verificar que todas las dependencias estén en package.json
npm install

# Hacer build local para verificar
npm run build
```

### Error: API Calls Failing

```bash
# Verificar variable de entorno
echo $VITE_API_URL

# Verificar que el backend esté desplegado y funcionando
curl https://tu-backend-render.onrender.com/api/health
```

### Error: 404 en Rutas

- Verificar que el archivo `public/_redirects` existe
- Verificar configuración de routing en `render.yaml`

### Performance Issues

```bash
# Analizar bundle size
npm run build -- --analyze

# Verificar que code splitting esté funcionando
# Revisar archivos en dist/assets/
```

## Configuración de Dominio SSL

Render proporciona SSL automático para:

- Subdominios de Render (\*.onrender.com)
- Dominios personalizados

### Configurar HTTPS Redirect

```yaml
# En render.yaml (ya incluido)
headers:
  - path: /*
    name: Strict-Transport-Security
    value: max-age=31536000; includeSubDomains; preload
```

## Backup y Rollback

### 1. Rollback Automático

Render mantiene historial de deploys:

1. **Ir a Dashboard → Deploys**
2. **Seleccionar deploy anterior**
3. **Click en "Redeploy"**

### 2. Backup de Código

```bash
# Tag releases para fácil rollback
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## Configuración de Staging

Para entorno de staging:

```yaml
# render-staging.yaml
services:
  - type: web
    name: sistema-gestion-agricola-staging
    env: static
    branch: develop
    buildCommand: npm ci && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_API_URL
        value: https://backend-staging.onrender.com/api
```

## Security Headers

Los siguientes headers de seguridad están configurados:

```yaml
headers:
  - path: /*
    name: X-Frame-Options
    value: DENY
  - path: /*
    name: X-Content-Type-Options
    value: nosniff
  - path: /*
    name: Referrer-Policy
    value: strict-origin-when-cross-origin
```

## Costos en Render

- **Static Sites**: Gratis para proyectos públicos
- **Bandwidth**: 100GB/mes incluidos
- **Build Time**: 500 minutos/mes incluidos

Para más recursos, considera los planes pagos.

## Contacto y Soporte

Para problemas específicos de deploy:

1. Revisar logs en Render Dashboard
2. Consultar [Render Docs](https://render.com/docs)
3. Crear issue en el repositorio del proyecto
