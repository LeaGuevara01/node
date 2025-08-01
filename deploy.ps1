# Script de deployment para Render usando Blueprints
# Este script prepara y valida la configuracion antes del deployment

Write-Host "Preparando deployment para Render..." -ForegroundColor Green

# Verificar que estamos en la rama main
try {
    $currentBranch = git branch --show-current
    if ($currentBranch -ne "main") {
        Write-Host "Advertencia: No estas en la rama main. Estas en: $currentBranch" -ForegroundColor Yellow
        $confirm = Read-Host "Continuar con el deployment? (y/N)"
        if ($confirm -notin @('y', 'Y', 'yes', 'Yes')) {
            Write-Host "Deployment cancelado" -ForegroundColor Red
            exit 1
        }
    }
}
catch {
    Write-Host "No se pudo verificar la rama actual. Asegurate de estar en main." -ForegroundColor Yellow
}

# Verificar archivos necesarios
Write-Host "Verificando archivos de configuracion..." -ForegroundColor Cyan

$requiredFiles = @(
    "render.yaml",
    "server/package.json", 
    "client/package.json",
    "server/prisma/schema.prisma"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "No se encontro $file" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Todos los archivos necesarios estan presentes" -ForegroundColor Green

# Verificar que las dependencias estan instaladas
Write-Host "Verificando dependencias..." -ForegroundColor Cyan

if (-not (Test-Path "server/node_modules")) {
    Write-Host "Dependencias del servidor no encontradas. Instalando..." -ForegroundColor Yellow
    Set-Location server
    npm install
    Set-Location ..
}

if (-not (Test-Path "client/node_modules")) {
    Write-Host "Dependencias del cliente no encontradas. Instalando..." -ForegroundColor Yellow
    Set-Location client
    npm install
    Set-Location ..
}

# Verificar build del cliente
Write-Host "Verificando build del cliente..." -ForegroundColor Cyan
Set-Location client

if (-not (Test-Path "dist") -or (Get-ChildItem "dist" -ErrorAction SilentlyContinue).Count -eq 0) {
    Write-Host "Compilando cliente..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error al compilar el cliente" -ForegroundColor Red
        exit 1
    }
}
Set-Location ..

# Mostrar configuracion
Write-Host ""
Write-Host "Configuracion de deployment:" -ForegroundColor Cyan
Write-Host "   - Base de datos: PostgreSQL EXISTENTE (sistema_gestion_agricola)"
Write-Host "   - Usuario DB: elorza"
Write-Host "   - Backend: Node.js en plan starter"
Write-Host "   - Frontend: Sitio estatico en plan free"
Write-Host "   - Region: Oregon"
Write-Host "   - Auto-deploy: Habilitado"
Write-Host ""
Write-Host "IMPORTANTE: Debes configurar DATABASE_URL manualmente:" -ForegroundColor Yellow
Write-Host "   DATABASE_URL = postgresql://elorza:[password]@dpg-d1qpnlodl3ps73eln790-a:5432/sistema_gestion_agricola"
Write-Host ""

# Confirmar deployment
$confirm = Read-Host "Proceder con el deployment en Render? (y/N)"
if ($confirm -notin @('y', 'Y', 'yes', 'Yes')) {
    Write-Host "Deployment cancelado" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Configuracion validada. Instrucciones para deployment:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Hacer commit de los cambios:" -ForegroundColor Yellow
Write-Host "   git add ."
Write-Host "   git commit -m 'Configuracion final para deployment en Render'"
Write-Host "   git push origin main"
Write-Host ""
Write-Host "2. En Render Dashboard:" -ForegroundColor Yellow
Write-Host "   - Ir a https://dashboard.render.com/"
Write-Host "   - Hacer clic en 'New' > 'Blueprint'"
Write-Host "   - Conectar el repositorio de GitHub"
Write-Host "   - Seleccionar la rama 'main'"
Write-Host "   - Render detectara automaticamente render.yaml"
Write-Host "   - Hacer clic en 'Deploy'"
Write-Host ""
Write-Host "3. Configurar DATABASE_URL:" -ForegroundColor Yellow
Write-Host "   - Ve a tu Backend Service > Environment"
Write-Host "   - Agregar variable: DATABASE_URL"
Write-Host "   - Valor: postgresql://elorza:[tu-password]@dpg-d1qpnlodl3ps73eln790-a:5432/sistema_gestion_agricola"
Write-Host ""
Write-Host "4. URLs de deployment:" -ForegroundColor Yellow
Write-Host "   - API: https://sistemagestionagricola.onrender.com"
Write-Host "   - Frontend: https://sistemagestionagricola-frontend.onrender.com"
Write-Host "   - Health Check: https://sistemagestionagricola.onrender.com/api/health"
Write-Host ""
Write-Host "Deployment preparado correctamente!" -ForegroundColor Green
