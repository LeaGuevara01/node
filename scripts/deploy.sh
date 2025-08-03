#!/bin/bash

# Script de deployment para Render usando Blueprints
# Este script prepara y valida la configuración antes del deployment

echo "🚀 Preparando deployment para Render..."

# Verificar que estamos en la rama main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Advertencia: No estás en la rama main. Estás en: $CURRENT_BRANCH"
    read -p "¿Continuar con el deployment? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelado"
        exit 1
    fi
fi

# Verificar archivos necesarios
echo "🔍 Verificando archivos de configuración..."

if [ ! -f "render.yaml" ]; then
    echo "❌ No se encontró render.yaml"
    exit 1
fi

if [ ! -f "server/package.json" ]; then
    echo "❌ No se encontró server/package.json"
    exit 1
fi

if [ ! -f "client/package.json" ]; then
    echo "❌ No se encontró client/package.json"
    exit 1
fi

if [ ! -f "server/prisma/schema.prisma" ]; then
    echo "❌ No se encontró server/prisma/schema.prisma"
    exit 1
fi

echo "✅ Todos los archivos necesarios están presentes"

# Verificar que las dependencias están instaladas
echo "📦 Verificando dependencias..."

if [ ! -d "server/node_modules" ]; then
    echo "⚠️  Dependencias del servidor no encontradas. Instalando..."
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "⚠️  Dependencias del cliente no encontradas. Instalando..."
    cd client && npm install && cd ..
fi

# Verificar build del cliente
echo "🔨 Verificando build del cliente..."
cd client
if [ ! -d "dist" ] || [ -z "$(ls -A dist 2>/dev/null)" ]; then
    echo "📦 Compilando cliente..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Error al compilar el cliente"
        exit 1
    fi
fi
cd ..

# Verificar sintaxis de render.yaml
echo "🔍 Validando render.yaml..."
if command -v yamllint >/dev/null 2>&1; then
    yamllint render.yaml
    if [ $? -ne 0 ]; then
        echo "❌ Error de sintaxis en render.yaml"
        exit 1
    fi
else
    echo "⚠️  yamllint no está instalado. Saltando validación de sintaxis."
fi

# Mostrar configuración
echo ""
echo "📋 Configuración de deployment:"
echo "   - Base de datos: PostgreSQL (sistemagestionagricola-db)"
echo "   - Backend: Node.js en plan starter"
echo "   - Frontend: Sitio estático en plan free"
echo "   - Región: Oregon"
echo "   - Auto-deploy: Habilitado"
echo ""

# Confirmar deployment
read -p "🚀 ¿Proceder con el deployment en Render? (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelado"
    exit 1
fi

echo ""
echo "✅ Configuración validada. Instrucciones para deployment:"
echo ""
echo "1. Hacer commit de los cambios:"
echo "   git add ."
echo "   git commit -m 'Configuración final para deployment en Render'"
echo "   git push origin main"
echo ""
echo "2. En Render Dashboard:"
echo "   - Ir a https://dashboard.render.com/"
echo "   - Hacer clic en 'New' > 'Blueprint'"
echo "   - Conectar el repositorio de GitHub"
echo "   - Seleccionar la rama 'main'"
echo "   - Render detectará automáticamente render.yaml"
echo "   - Hacer clic en 'Deploy'"
echo ""
echo "3. URLs de deployment:"
echo "   - API: https://sistemagestionagricola.onrender.com"
echo "   - Frontend: https://sistemagestionagricola-frontend.onrender.com"
echo "   - Health Check: https://sistemagestionagricola.onrender.com/api/health"
echo ""
echo "🎉 ¡Deployment preparado correctamente!"
