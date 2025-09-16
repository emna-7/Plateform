@echo off
REM Script OWASP Security Scan pour Jenkins sur Windows
REM Vérifie les vulnérabilités de sécurité dans les dépendances

echo 🔒 Starting OWASP Security Scan...

REM Créer le dossier de rapports
if not exist "security-reports" mkdir security-reports

REM 1. NPM Audit - Vérification des vulnérabilités npm
echo 📦 Running npm audit...
npm audit --audit-level=moderate --json > security-reports\npm-audit.json
if %errorlevel% neq 0 (
    echo ⚠️ npm audit found vulnerabilities
    npm audit --audit-level=moderate
)

REM 2. NPM Audit High - Vérification des vulnérabilités critiques
echo 🚨 Checking high severity vulnerabilities...
npm audit --audit-level=high --json > security-reports\npm-audit-high.json
if %errorlevel% neq 0 (
    echo ❌ High severity vulnerabilities found!
    npm audit --audit-level=high
)

REM 3. Vérification des packages obsolètes
echo 📅 Checking for outdated packages...
npm outdated --json > security-reports\npm-outdated.json
if %errorlevel% neq 0 (
    echo ⚠️ Some packages are outdated
    npm outdated
)

REM 4. Vérification des scripts potentiellement dangereux
echo 🔍 Checking for potentially dangerous scripts...
if exist package.json (
    findstr /i "eval exec system" package.json >nul
    if %errorlevel% == 0 (
        echo ⚠️ Potentially dangerous scripts found in package.json
    )
)

REM 5. Vérification des fichiers sensibles
echo 🔐 Checking for sensitive files...
dir /s /b *.key *.pem *.p12 *.pfx 2>nul
if %errorlevel% == 0 (
    echo ⚠️ Sensitive files found - please review permissions
)

REM 6. Génération du rapport de synthèse
echo 📊 Generating security summary...
(
echo # Security Scan Summary
echo.
echo ## Scan Date
echo %date% %time%
echo.
echo ## NPM Audit Results
echo - Check npm-audit.json for detailed results
echo - Check npm-audit-high.json for high severity issues
echo.
echo ## Outdated Packages
echo - Check npm-outdated.json for outdated packages
echo.
echo ## Recommendations
echo 1. Update vulnerable packages to latest secure versions
echo 2. Review and update outdated dependencies
echo 3. Regularly run security scans
echo 4. Implement automated security monitoring
) > security-reports\security-summary.md

echo ✅ OWASP Security Scan completed!
echo 📁 Reports saved in security-reports\
dir security-reports
