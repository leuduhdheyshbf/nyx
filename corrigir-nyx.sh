#!/bin/bash
# ============================================================
#  Nyx Bot - Script de correção de nomenclatura
#  - MisheruModz → LCSX
#  - columbina → nyx (variável real do código)
#  - AudioMisheru → AudioNyx
#  - Remove Columbina / COLUMBINA dos comentários
# ============================================================
# Uso:
#   1. Coloque este arquivo na RAIZ do bot (junto do index.js)
#   2. chmod +x corrigir-nyx.sh
#   3. ./corrigir-nyx.sh
# ============================================================

set -euo pipefail

# Vai para a pasta onde o script está (raiz do bot)
cd "$(dirname "$0")"

# Segurança: precisa existir index.js
if [[ ! -f "index.js" ]]; then
  echo "❌ Erro: index.js não encontrado."
  echo "   Execute este script na raiz do Nyx Bot."
  exit 1
fi

echo "🔍 Nyx Bot - iniciando correção de nomenclatura..."
echo ""

# ------------------------------------------------------------
# 1) Backup automático
# ------------------------------------------------------------
BACKUP_DIR="backup_nomenclatura_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Criando backup em: $BACKUP_DIR"

# Copia preservando estrutura de pastas (sem node_modules)
find . -type f \( -name "*.js" -o -name "*.json" \) \
  ! -path "./node_modules/*" \
  ! -path "./${BACKUP_DIR}/*" \
  ! -path "./backup_nomenclatura_*/*" \
  -print0 | while IFS= read -r -d '' file; do
    mkdir -p "$BACKUP_DIR/$(dirname "$file")"
    cp -a "$file" "$BACKUP_DIR/$file"
done

echo "✅ Backup concluído."
echo ""

# ------------------------------------------------------------
# 2) Lista de arquivos a modificar
# ------------------------------------------------------------
mapfile -d '' FILES < <(
  find . -type f \( -name "*.js" -o -name "*.json" \) \
    ! -path "./node_modules/*" \
    ! -path "./${BACKUP_DIR}/*" \
    ! -path "./backup_nomenclatura_*/*" \
    -print0
)

TOTAL=${#FILES[@]}
echo "📄 Arquivos encontrados: $TOTAL"
echo ""

# ------------------------------------------------------------
# 3) Substituições
# ------------------------------------------------------------
MODIFICADOS=0

for file in "${FILES[@]}"; do
  # Pula se por algum motivo estiver vazio
  [[ -z "$file" ]] && continue
  [[ ! -f "$file" ]] && continue

  # Cópia temporária para detectar se houve mudança
  tmp="${file}.nyx_tmp"
  cp -a "$file" "$tmp"

  # ---- Créditos / nomes Misheru* → LCSX ----
  # Funciona em .js e .json
  sed -i \
    -e 's/MisheruModz/LCSX/g' \
    -e 's/MISHERUMODZ/LCSX/g' \
    -e 's/MisheruSlakk/LCSXUpload/g' \
    -e 's/Misheruzin/LCSXUserAgent/g' \
    -e 's/AudioMisheru/AudioNyx/g' \
    "$tmp"

  # ---- Só em arquivos .js: variável + textos Columbina ----
  if [[ "$file" == *.js ]]; then
    # Remove menções textuais nos comentários
    sed -i \
      -e 's/COLUMBINA//g' \
      -e 's/Columbina//g' \
      "$tmp"

    # Renomeia a variável real columbina → nyx
    # \b = limite de palavra (GNU sed / Arch Linux)
    sed -i -E 's/\bcolumbina\b/nyx/g' "$tmp"
  fi

  # Se o conteúdo mudou, aplica e conta
  if ! cmp -s "$file" "$tmp"; then
    mv "$tmp" "$file"
    MODIFICADOS=$((MODIFICADOS + 1))
    echo "  ✓ $file"
  else
    rm -f "$tmp"
  fi
done

echo ""
echo "============================================================"
echo "✅ Correção concluída com sucesso!"
echo "============================================================"
echo "📊 Arquivos verificados : $TOTAL"
echo "✏️  Arquivos modificados: $MODIFICADOS"
echo "📁 Backup salvo em      : $BACKUP_DIR"
echo ""
echo "Alterações aplicadas:"
echo "  • MisheruModz / MISHERUMODZ → LCSX"
echo "  • AudioMisheru → AudioNyx"
echo "  • variável columbina → nyx"
echo "  • Columbina / COLUMBINA removidos dos comentários"
echo "  • node_modules/ NÃO foi alterado"
echo ""
echo "🔄 Reinicie o bot: sh start.sh"
echo "============================================================"
