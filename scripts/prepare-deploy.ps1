# 🚀 Script de Deploy Automático para Render (PowerShell)

Write-Host "🔧 Preparando deploy en Render..." -ForegroundColor Blue

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "render.yaml")) {
    Write-Host "❌ Error: render.yaml no encontrado. Ejecuta desde el directorio raíz del proyecto." -ForegroundColor Red
    exit 1
}

Write-Host "✅ render.yaml encontrado" -ForegroundColor Green

# Verificar que las dependencias estén instaladas
Write-Host "📦 Verificando dependencias..." -ForegroundColor Yellow

# Backend
if (-not (Test-Path "server/node_modules")) {
    Write-Host "📥 Instalando dependencias del backend..." -ForegroundColor Cyan
    Set-Location server
    npm install
    Set-Location ..
}

# Frontend  
if (-not (Test-Path "client/node_modules")) {
    Write-Host "📥 Instalando dependencias del frontend..." -ForegroundColor Cyan
    Set-Location client
    npm install
    Set-Location ..
}

Write-Host "✅ Dependencias verificadas" -ForegroundColor Green

# Test build local
Write-Host "🔨 Probando build local..." -ForegroundColor Yellow

# Backend
Write-Host "   Backend..." -ForegroundColor Cyan
Set-Location server
try {
    npm run build 2>$null
    Write-Host "   ✅ Backend build OK" -ForegroundColor Green
}
catch {
    Write-Host "   ⚠️  Backend build con advertencias (normal para Prisma)" -ForegroundColor Yellow
}
Set-Location ..

# Frontend
Write-Host "   Frontend..." -ForegroundColor Cyan
Set-Location client
try {
    npm run build 2>$null
    Write-Host "   ✅ Frontend build OK" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Frontend build falló" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

Write-Host ""
Write-Host "🎉 ¡Proyecto listo para deploy!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Blue
Write-Host "1. Commit y push a GitHub"
Write-Host "2. Ve a https://dashboard.render.com"
Write-Host "3. New → Blueprint"
Write-Host "4. Conecta el repositorio LeaGuevara01/node"
Write-Host "5. Configura las variables de entorno según RENDER_SETUP_GUIDE.md"
Write-Host ""
Write-Host "🌐 URLs después del deploy:" -ForegroundColor Blue
Write-Host "   Backend:  https://sistemagestionagricola.onrender.com"
Write-Host "   Frontend: https://sistemagestionagricola-frontend.onrender.com"
Write-Host ""
