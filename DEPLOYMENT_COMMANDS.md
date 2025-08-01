# 🔧 Comandos de Deployment - Guía de Referencia

## 🚫 **NO usar (Python/Django/Flask):**

```bash
gunicorn run:app              # Para Flask/Django (Python)
uvicorn main:app             # Para FastAPI (Python)
python app.py                # Para aplicaciones Python
wsgi:application             # Para aplicaciones WSGI
```

## ✅ **SÍ usar (Node.js/Express):**

```bash
npm start                    # Tu comando actual en render.yaml
node src/index.js           # Comando directo
npm run dev                 # Para desarrollo local
nodemon src/index.js        # Para desarrollo con hot-reload
```

## 📋 **Tu Configuración Actual (Correcta):**

### render.yaml:

```yaml
env: node # ✅ Correcto para Node.js
buildCommand: npm install && npx prisma generate && npx prisma db push
startCommand: npm start # ✅ Ejecuta: node src/index.js
```

### package.json:

```json
"scripts": {
  "start": "node src/index.js"  # ✅ Comando de producción
}
```

## 🎯 **Próximos Pasos:**

1. **Commit y Push:**

   ```bash
   git add .
   git commit -m "Configuración final para deployment"
   git push origin main
   ```

2. **Deploy en Render:**

   - Dashboard → New → Blueprint
   - Conectar repo LeaGuevara01/node
   - Branch: main

3. **Configurar DATABASE_URL:**
   ```
   postgresql://elorza:[tu-password]@dpg-d1qpnlodl3ps73eln790-a:5432/sistema_gestion_agricola
   ```

¡Tu configuración Node.js está perfecta! 🚀
