#!/bin/bash
cd "$(dirname "$0")"
echo "⚔ Iniciando Nyx Bot..."
ARGS=""
if [ "$1" = "cod" ] || [ "$1" = "code" ] || [ "$1" = "--code" ]; then
    ARGS="--code"
fi
while true; do
    node index.js $ARGS
    echo "⚔ Reiniciando em 3s... (Ctrl+C para parar)"
    sleep 3
done
