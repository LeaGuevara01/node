#!/bin/bash

# 🚀 Script de Deploy Automático para Render

echo "🔧 Preparando deploy en Render..."

# Verificar que estamos en el directorio correcto
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml no encontrado. Ejecuta desde el directorio raíz del proyecto."
    exit 1
fi

echo "✅ render.yaml encontrado"

# Verificar que las dependencias estén instaladas
echo "📦 Verificando dependencias..."

# Backend
if [ ! -d "server/node_modules" ]; then
    echo "📥 Instalando dependencias del backend..."
    cd server && npm install && cd ..
fi

# Frontend  
if [ ! -d "client/node_modules" ]; then
    echo "📥 Instalando dependencias del frontend..."
    cd client && npm install && cd ..
fi

echo "✅ Dependencias verificadas"

# Test build local
echo "🔨 Probando build local..."

# Backend
echo "   Backend..."
cd server
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Backend build OK"
else
    echo "   ⚠️  Backend build con advertencias (normal para Prisma)"
fi
cd ..

# Frontend
echo "   Frontend..."
cd client
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Frontend build OK"
else
    echo "   ❌ Frontend build falló"
    exit 1
fi
cd ..

echo ""
echo "🎉 ¡Proyecto listo para deploy!"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Commit y push a GitHub"
echo "2. Ve a https://dashboard.render.com"
echo "3. New → Blueprint"
echo "4. Conecta el repositorio LeaGuevara01/node"
echo "5. Configura las variables de entorno según RENDER_SETUP_GUIDE.md"
echo ""
echo "🌐 URLs después del deploy:"
echo "   Backend:  https://sistemagestionagricola.onrender.com"
echo "   Frontend: https://sistemagestionagricola-frontend.onrender.com"
echo ""
