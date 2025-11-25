#!/bin/bash
# Script para hacer commit y push automático
# Uso: ./git-commit-push.sh "Mensaje del commit"

if [ -z "$1" ]; then
    echo "Error: Debes proporcionar un mensaje para el commit"
    echo "Uso: ./git-commit-push.sh 'Mensaje del commit'"
    exit 1
fi

MENSAJE="$1"

# Verificar que estamos en un repositorio git
if [ ! -d .git ]; then
    echo "Error: No se encontró un repositorio git en este directorio"
    exit 1
fi

# Verificar que hay cambios para commitear
if [ -z "$(git status --porcelain)" ]; then
    echo "No hay cambios para commitear"
    exit 0
fi

# Agregar todos los cambios
echo "Agregando cambios..."
git add .

# Hacer commit
echo "Haciendo commit con mensaje: $MENSAJE"
git commit -m "$MENSAJE"

# Verificar si hay un remoto configurado
if [ -z "$(git remote)" ]; then
    echo "Advertencia: No hay remoto configurado. Solo se hizo commit local."
    echo "Para configurar un remoto, usa: git remote add origin <url>"
    exit 0
fi

# Hacer push
echo "Haciendo push al remoto..."
BRANCH=$(git branch --show-current)
git push origin "$BRANCH"

if [ $? -eq 0 ]; then
    echo "¡Commit y push completados exitosamente!"
else
    echo "Error al hacer push. Verifica la configuración del remoto."
    exit 1
fi

