# Verificacion Final de Deploy

## Verificar que todo este correcto antes del deploy

Write-Host "Verificando configuracion de deploy..." -ForegroundColor Cyan
Write-Host ""

# Verificar archivos de configuracion
$configFiles = @(
    "render.yaml",
    "client\.env.production", 
    "server\.env",
    "client\package.json",
    "server\package.json"
)

Write-Host "Verificando archivos de configuracion..." -ForegroundColor Yellow
foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "OK $file existe" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR $file NO encontrado" -ForegroundColor Red
    }
}

Write-Host ""

# Verificar dependencias del server
Write-Host "Verificando dependencias del servidor..." -ForegroundColor Yellow
if (Test-Path "server\package.json") {
    $serverPackage = Get-Content "server\package.json" | ConvertFrom-Json
    
    # Verificar dependencias criticas
    $criticalDeps = @("express", "prisma", "@prisma/client", "cors", "jsonwebtoken")
    foreach ($dep in $criticalDeps) {
        if ($serverPackage.dependencies.$dep -or $serverPackage.devDependencies.$dep) {
            Write-Host "OK $dep encontrado" -ForegroundColor Green
        }
        else {
            Write-Host "ERROR $dep NO encontrado" -ForegroundColor Red
        }
    }
    
    # Verificar scripts
    if ($serverPackage.scripts.build) {
        Write-Host "OK Script build configurado: $($serverPackage.scripts.build)" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR Script build NO configurado" -ForegroundColor Red
    }
    
    if ($serverPackage.scripts.start) {
        Write-Host "OK Script start configurado: $($serverPackage.scripts.start)" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR Script start NO configurado" -ForegroundColor Red
    }
}

Write-Host ""

# Verificar dependencias del client
Write-Host "Verificando dependencias del cliente..." -ForegroundColor Yellow
if (Test-Path "client\package.json") {
    $clientPackage = Get-Content "client\package.json" | ConvertFrom-Json
    
    # Verificar dependencias criticas
    $criticalDeps = @("react", "vite", "axios")
    foreach ($dep in $criticalDeps) {
        if ($clientPackage.dependencies.$dep -or $clientPackage.devDependencies.$dep) {
            Write-Host "OK $dep encontrado" -ForegroundColor Green
        }
        else {
            Write-Host "ERROR $dep NO encontrado" -ForegroundColor Red
        }
    }
    
    # Verificar scripts
    if ($clientPackage.scripts.build) {
        Write-Host "OK Script build configurado: $($clientPackage.scripts.build)" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR Script build NO configurado" -ForegroundColor Red
    }
}

Write-Host ""

# Verificar conexion a base de datos (simulada)
Write-Host "Verificando configuracion de base de datos..." -ForegroundColor Yellow
if (Test-Path "server\.env") {
    $envContent = Get-Content "server\.env"
    $hasDbUrl = $envContent | Where-Object { $_ -match "DATABASE_URL.*postgresql.*sistema_gestion_agricola" }
    if ($hasDbUrl) {
        Write-Host "OK DATABASE_URL configurada correctamente" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR DATABASE_URL no encontrada o incorrecta" -ForegroundColor Red
    }
}

Write-Host ""

# Verificar estructura de Prisma
Write-Host "Verificando configuracion de Prisma..." -ForegroundColor Yellow
if (Test-Path "server\prisma\schema.prisma") {
    Write-Host "OK Schema de Prisma encontrado" -ForegroundColor Green
    
    $schemaContent = Get-Content "server\prisma\schema.prisma" -Raw
    if ($schemaContent -match 'provider\s*=\s*"postgresql"') {
        Write-Host "OK Provider PostgreSQL configurado" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR Provider PostgreSQL NO configurado" -ForegroundColor Red
    }
}
else {
    Write-Host "ERROR Schema de Prisma NO encontrado" -ForegroundColor Red
}

Write-Host ""

# Verificar render.yaml
Write-Host "Verificando configuracion de Render..." -ForegroundColor Yellow
if (Test-Path "render.yaml") {
    $renderContent = Get-Content "render.yaml" -Raw
    
    # Verificar servicios
    if ($renderContent -match "name:\s*sistemagestionagricola") {
        Write-Host "OK Servicio backend configurado correctamente" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR Servicio backend NO configurado" -ForegroundColor Red
    }
    
    if ($renderContent -match "name:\s*sistemagestionagricola-frontend") {
        Write-Host "OK Servicio frontend configurado correctamente" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR Servicio frontend NO configurado" -ForegroundColor Red
    }
    
    # Verificar database URL
    if ($renderContent -match "sistema_gestion_agricola") {
        Write-Host "OK Base de datos existente referenciada" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR Base de datos NO referenciada" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Resumen de verificacion:" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host "Si todos los elementos muestran OK, estas listo para el deploy." -ForegroundColor Green
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor White
Write-Host "1. git add ." -ForegroundColor Gray
Write-Host "2. git commit -m 'Deploy configuration ready'" -ForegroundColor Gray  
Write-Host "3. git push origin main" -ForegroundColor Gray
Write-Host "4. Ir a Render Dashboard -> New -> Blueprint" -ForegroundColor Gray
Write-Host "5. Seleccionar render.yaml y aplicar" -ForegroundColor Gray
Write-Host ""
Write-Host "URLs despues del deploy:" -ForegroundColor White
Write-Host "Backend:  https://sistemagestionagricola.onrender.com" -ForegroundColor Cyan
Write-Host "Frontend: https://sistemagestionagricola-frontend.onrender.com" -ForegroundColor Cyan
