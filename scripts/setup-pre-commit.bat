@echo off
REM Script pour installer et configurer les pre-commit hooks sur Windows

echo 🔧 Setting up pre-commit hooks...

REM Vérifier si Python est installé
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python n'est pas installé. Veuillez installer Python d'abord.
    exit /b 1
)

REM Installer pre-commit
echo 📦 Installing pre-commit...
pip install pre-commit

REM Installer les hooks
echo 🔗 Installing pre-commit hooks...
pre-commit install

REM Tester les hooks
echo 🧪 Testing pre-commit hooks...
pre-commit run --all-files

echo ✅ Pre-commit hooks configurés avec succès!
echo 💡 Les hooks s'exécuteront automatiquement à chaque commit.
