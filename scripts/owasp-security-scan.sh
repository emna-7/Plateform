#!/bin/bash

# Script OWASP Security Scan pour Jenkins
# Vérifie les vulnérabilités de sécurité dans les dépendances

set -e

echo "🔒 Starting OWASP Security Scan..."

# Créer le dossier de rapports
mkdir -p ./security-reports

# 1. NPM Audit - Vérification des vulnérabilités npm
echo "📦 Running npm audit..."
npm audit --audit-level=moderate --json > ./security-reports/npm-audit.json || {
    echo "⚠️ npm audit found vulnerabilities"
    npm audit --audit-level=moderate
}

# 2. NPM Audit High - Vérification des vulnérabilités critiques
echo "🚨 Checking high severity vulnerabilities..."
npm audit --audit-level=high --json > ./security-reports/npm-audit-high.json || {
    echo "❌ High severity vulnerabilities found!"
    npm audit --audit-level=high
}

# 3. Vérification des packages obsolètes
echo "📅 Checking for outdated packages..."
npm outdated --json > ./security-reports/npm-outdated.json || {
    echo "⚠️ Some packages are outdated"
    npm outdated
}

# 4. OWASP Dependency Check (si disponible)
if command -v dependency-check.sh >/dev/null 2>&1; then
    echo "🔍 Running OWASP Dependency Check..."
    dependency-check.sh \
        --project "Plateform" \
        --scan . \
        --format JSON \
        --format HTML \
        --out ./security-reports/ \
        --enableRetired \
        --enableExperimental || {
        echo "⚠️ OWASP Dependency Check completed with warnings"
    }
else
    echo "ℹ️ OWASP Dependency Check not available, using npm audit only"
fi

# 5. Vérification des scripts potentiellement dangereux
echo "🔍 Checking for potentially dangerous scripts..."
if [ -f package.json ]; then
    # Vérifier les scripts qui pourraient être dangereux
    if grep -q "eval\|exec\|system" package.json; then
        echo "⚠️ Potentially dangerous scripts found in package.json"
    fi
fi

# 6. Vérification des permissions de fichiers sensibles
echo "🔐 Checking file permissions..."
find . -name "*.key" -o -name "*.pem" -o -name "*.p12" -o -name "*.pfx" | while read -r file; do
    if [ -f "$file" ]; then
        perms=$(stat -c "%a" "$file" 2>/dev/null || echo "unknown")
        if [ "$perms" != "600" ] && [ "$perms" != "400" ]; then
            echo "⚠️ Sensitive file $file has permissions $perms (should be 600 or 400)"
        fi
    fi
done

# 7. Génération du rapport de synthèse
echo "📊 Generating security summary..."
cat > ./security-reports/security-summary.md << EOF
# Security Scan Summary

## Scan Date
$(date)

## NPM Audit Results
- Moderate vulnerabilities: $(jq '.metadata.vulnerabilities.moderate // 0' ./security-reports/npm-audit.json 2>/dev/null || echo "N/A")
- High vulnerabilities: $(jq '.metadata.vulnerabilities.high // 0' ./security-reports/npm-audit-high.json 2>/dev/null || echo "N/A")
- Critical vulnerabilities: $(jq '.metadata.vulnerabilities.critical // 0' ./security-reports/npm-audit.json 2>/dev/null || echo "N/A")

## Outdated Packages
$(jq -r 'keys[]' ./security-reports/npm-outdated.json 2>/dev/null | wc -l || echo "N/A") packages are outdated

## Recommendations
1. Update vulnerable packages to latest secure versions
2. Review and update outdated dependencies
3. Regularly run security scans
4. Implement automated security monitoring

EOF

echo "✅ OWASP Security Scan completed!"
echo "📁 Reports saved in ./security-reports/"
ls -la ./security-reports/
