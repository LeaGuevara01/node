# Script de sanitizacion de seguridad
# Ejecutar antes de hacer publico el repositorio

Write-Host "Iniciando sanitizacion de seguridad..." -ForegroundColor Red

# Verificar si estamos en el directorio correcto
if (-not (Test-Path "package.json") -and -not (Test-Path "server/package.json")) {
    Write-Host "Error: No se encuentra en el directorio raiz del proyecto" -ForegroundColor Red
    exit 1
}

Write-Host "Verificando archivos comprometidos..." -ForegroundColor Yellow

# Lista de archivos con credenciales expuestas
$compromisedFiles = @(
    "DEPLOY_FINAL.md",
    "DEPLOYMENT_COMMANDS.md", 
    "DATABASE_CONNECTION_GUIDE.md",
    "RENDER_DEPLOY_GUIDE.md"
)

$foundFiles = @()
foreach ($file in $compromisedFiles) {
    if (Test-Path $file) {
        $foundFiles += $file
        Write-Host "Encontrado: $file" -ForegroundColor Red
    }
}

if ($foundFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "ARCHIVOS CON CREDENCIALES ENCONTRADOS:" -ForegroundColor Red
    foreach ($file in $foundFiles) {
        Write-Host "   - $file" -ForegroundColor Red
    }
    
    Write-Host ""
    $action = Read-Host "Quieres eliminarlos del repositorio? (y/N)"
    
    if ($action -in @('y', 'Y', 'yes', 'Yes')) {
        foreach ($file in $foundFiles) {
            Write-Host "Eliminando $file..." -ForegroundColor Yellow
            git rm $file 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "$file eliminado del repositorio" -ForegroundColor Green
            } else {
                Write-Host "$file no estaba en git, eliminando del filesystem..." -ForegroundColor Yellow
                Remove-Item $file -ErrorAction SilentlyContinue
            }
        }
    }
}

# Verificar archivos .env
Write-Host ""
Write-Host "Verificando archivos .env..." -ForegroundColor Yellow

$envFiles = Get-ChildItem -Path . -Recurse -Name ".env*" -Force 2>$null
if ($envFiles.Count -gt 0) {
    Write-Host "Archivos .env encontrados:" -ForegroundColor Yellow
    foreach ($env in $envFiles) {
        Write-Host "   - $env" -ForegroundColor Yellow
        # Verificar si contiene credenciales reales
        if ($env -like "*.local" -or $env -eq ".env") {
            try {
                $content = Get-Content $env -Raw -ErrorAction SilentlyContinue
                if ($content -and ($content -match "postgresql://.*:.*@.*" -or $content -match "JWT_SECRET=(?!your-|test-|dev-)")) {
                    Write-Host "     CONTIENE CREDENCIALES REALES" -ForegroundColor Red
                }
            } catch {
                # Ignorar errores de lectura
            }
        }
    }
    Write-Host "Verificar que esten en .gitignore" -ForegroundColor Green
}

# Verificar .gitignore
Write-Host ""
Write-Host "Verificando .gitignore..." -ForegroundColor Yellow

if (-not (Test-Path ".gitignore")) {
    Write-Host ".gitignore no encontrado" -ForegroundColor Red
} else {
    $gitignoreContent = Get-Content ".gitignore" -Raw
    $securityPatterns = @(".env", "*.key", "*.pem", "secrets", "credenciales")
    
    foreach ($pattern in $securityPatterns) {
        if ($gitignoreContent -match [regex]::Escape($pattern)) {
            Write-Host "$pattern esta en .gitignore" -ForegroundColor Green
        } else {
            Write-Host "$pattern NO esta en .gitignore" -ForegroundColor Yellow
        }
    }
}

# Buscar credenciales en archivos existentes
Write-Host ""
Write-Host "Buscando credenciales en archivos..." -ForegroundColor Yellow

$credentialPatterns = @(
    "postgresql://.*:.*@.*:.*/.+",
    "elorza.*password",
    "dpg-.*:5432",
    "JWT_SECRET.*=.*[^[]"
)

$foundCredentials = @()
foreach ($pattern in $credentialPatterns) {
    try {
        $searchResults = Select-String -Path "*.md", "*.js", "*.ts", "*.jsx", "*.tsx", "*.ps1" -Pattern $pattern -AllMatches 2>$null
        if ($searchResults) {
            $foundCredentials += $searchResults
        }
    } catch {
        # Ignorar errores de archivos no encontrados
    }
}

if ($foundCredentials.Count -gt 0) {
    Write-Host "CREDENCIALES ENCONTRADAS:" -ForegroundColor Red
    foreach ($result in $foundCredentials) {
        Write-Host "   $($result.Filename):$($result.LineNumber) - $($result.Pattern)" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "REVISAR Y SANITIZAR ESTOS ARCHIVOS MANUALMENTE" -ForegroundColor Yellow
} else {
    Write-Host "No se encontraron credenciales expuestas" -ForegroundColor Green
}

# Verificar estado de git
Write-Host ""
Write-Host "Verificando estado de Git..." -ForegroundColor Yellow

try {
    $gitStatus = git status --porcelain 2>$null
    if ($gitStatus) {
        Write-Host "Hay cambios sin commitear:" -ForegroundColor Yellow
        Write-Host $gitStatus
    } else {
        Write-Host "Git working directory limpio" -ForegroundColor Green
    }
} catch {
    Write-Host "No se pudo verificar estado de Git" -ForegroundColor Yellow
}

# Verificar rama actual
try {
    $currentBranch = git branch --show-current 2>$null
    if ($currentBranch) {
        $currentBranch = $currentBranch.Trim()
        Write-Host "Rama actual: $currentBranch" -ForegroundColor Cyan
        
        if ($currentBranch -ne "main") {
            Write-Host "No estas en la rama main" -ForegroundColor Yellow
        }
    } else {
        Write-Host "No se pudo determinar la rama actual" -ForegroundColor Yellow
    }
} catch {
    Write-Host "No se pudo verificar rama actual" -ForegroundColor Yellow
}

# Resumen final
Write-Host ""
Write-Host "RESUMEN DE SANITIZACION:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

if ($foundFiles.Count -eq 0 -and $foundCredentials.Count -eq 0) {
    Write-Host "REPOSITORIO SANITIZADO CORRECTAMENTE" -ForegroundColor Green
    Write-Host "No se encontraron credenciales expuestas" -ForegroundColor Green
    Write-Host "Archivos comprometidos eliminados" -ForegroundColor Green
} else {
    Write-Host "SANITIZACION PARCIAL - REVISAR MANUALMENTE" -ForegroundColor Yellow
    if ($foundFiles.Count -gt 0) {
        Write-Host "Archivos comprometidos: $($foundFiles.Count)" -ForegroundColor Yellow
    }
    if ($foundCredentials.Count -gt 0) {
        Write-Host "Credenciales encontradas: $($foundCredentials.Count)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "PROXIMOS PASOS RECOMENDADOS:" -ForegroundColor Yellow
Write-Host "1. Cambiar password de base de datos en Render" -ForegroundColor White
Write-Host "2. Rotar JWT_SECRET en variables de entorno" -ForegroundColor White
Write-Host "3. Verificar logs de acceso por 48h" -ForegroundColor White
Write-Host "4. Hacer commit de cambios de sanitizacion" -ForegroundColor White
Write-Host "5. Push y deployment con credenciales nuevas" -ForegroundColor White

Write-Host ""
Write-Host "SANITIZACION COMPLETADA" -ForegroundColor Green
