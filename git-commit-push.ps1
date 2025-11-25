# Script para hacer commit y push automático
# Uso: .\git-commit-push.ps1 "Mensaje del commit"

param(
    [Parameter(Mandatory=$true)]
    [string]$Mensaje
)

# Verificar que estamos en un repositorio git
if (-not (Test-Path .git)) {
    Write-Host "Error: No se encontró un repositorio git en este directorio" -ForegroundColor Red
    exit 1
}

# Verificar que hay cambios para commitear
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "No hay cambios para commitear" -ForegroundColor Yellow
    exit 0
}

# Agregar todos los cambios
Write-Host "Agregando cambios..." -ForegroundColor Cyan
git add .

# Hacer commit
Write-Host "Haciendo commit con mensaje: $Mensaje" -ForegroundColor Cyan
git commit -m $Mensaje

# Verificar si hay un remoto configurado
$remotes = git remote
if ($remotes.Count -eq 0) {
    Write-Host "Advertencia: No hay remoto configurado. Solo se hizo commit local." -ForegroundColor Yellow
    Write-Host "Para configurar un remoto, usa: git remote add origin <url>" -ForegroundColor Yellow
    exit 0
}

# Hacer push
Write-Host "Haciendo push al remoto..." -ForegroundColor Cyan
$branch = git branch --show-current
git push origin $branch

if ($LASTEXITCODE -eq 0) {
    Write-Host "¡Commit y push completados exitosamente!" -ForegroundColor Green
} else {
    Write-Host "Error al hacer push. Verifica la configuración del remoto." -ForegroundColor Red
    exit 1
}

