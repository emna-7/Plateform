#!/bin/bash

# Script pour installer et configurer les pre-commit hooks

echo "🔧 Setting up pre-commit hooks..."

# Vérifier si Python est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 n'est pas installé. Veuillez installer Python3 d'abord."
    exit 1
fi

# Installer pre-commit
echo "📦 Installing pre-commit..."
pip3 install pre-commit

# Installer les hooks
echo "🔗 Installing pre-commit hooks..."
pre-commit install

# Tester les hooks
echo "🧪 Testing pre-commit hooks..."
pre-commit run --all-files

echo "✅ Pre-commit hooks configurés avec succès!"
echo "💡 Les hooks s'exécuteront automatiquement à chaque commit."
